package com.maplewood.backend.service;

import com.maplewood.backend.dto.CourseDTO;
import com.maplewood.backend.dto.CourseSectionDTO;
import com.maplewood.backend.dto.TimeSlotDTO;
import com.maplewood.backend.model.Course;
import com.maplewood.backend.model.CourseSection;
import com.maplewood.backend.model.Student;
import com.maplewood.backend.model.TimeSlot;
import com.maplewood.backend.repository.CurrentEnrollmentRepository;
import com.maplewood.backend.repository.CourseRepository;
import com.maplewood.backend.repository.CourseSectionRepository;
import com.maplewood.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseCatalogService {

    private final CourseRepository courseRepo;
    private final CourseSectionRepository sectionRepo;
    private final StudentRepository studentRepo;
    private final CurrentEnrollmentRepository currentEnrollmentRepo;
    private final EnrollmentValidationService validationService;

    public List<CourseDTO> getAllCourses() {
        return courseRepo.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> getAvailableCoursesForStudent(Long studentId, String semester) {
        // Get student's grade level
        Student student = studentRepo.findById(studentId).orElseThrow();

        return courseRepo.findAll().stream()
                .map(course -> {
                    CourseDTO dto = convertToDTO(course);

                    // Add sections for this semester with enrollment eligibility feedback
                    List<CourseSectionDTO> sections = sectionRepo
                            .findByCourseIdAndSemester(course.getId(), semester)
                            .stream()
                            .map(section -> convertToSectionDTO(section, student))
                            .collect(Collectors.toList());

                    dto.setAvailableSections(sections);
                    return dto;
                })
                .filter(courseDTO -> courseDTO.getAvailableSections() != null && !courseDTO.getAvailableSections().isEmpty())
                .collect(Collectors.toList());
    }

    public CourseDTO convertToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setCode(course.getCode());
        dto.setName(course.getName());
        dto.setDescription(course.getDescription());
        dto.setHoursPerWeek(course.getHoursPerWeek());
        dto.setCourseType(course.getCourseType());
        dto.setSemesterOrder(course.getSemesterOrder());

        // Convert Double to Integer (prendi la parte intera)
        Double credits = course.getCredits();
        dto.setCredits(credits != null ? credits.intValue() : 0);

        // Usa i grade level dal database
        dto.setGradeLevelMin(course.getGradeLevelMin() != null ? course.getGradeLevelMin() : 9);
        dto.setGradeLevelMax(course.getGradeLevelMax() != null ? course.getGradeLevelMax() : 12);

        // Convert prerequisite without recursive chain expansion
        if (course.getPrerequisite() != null) {
            dto.setPrerequisite(convertPrerequisiteToDTO(course.getPrerequisite()));
        }

        return dto;
    }

    public CourseSectionDTO convertToSectionDTO(CourseSection section) {
        return convertToSectionDTO(section, null);
    }

    public CourseSectionDTO convertToSectionDTO(CourseSection section, Student student) {
        CourseSectionDTO dto = new CourseSectionDTO();
        dto.setId(section.getId());
        dto.setCourseId(section.getCourse().getId());
        dto.setCourseName(section.getCourse().getName());
        dto.setSectionCode(section.getSectionCode());
        dto.setSemester(section.getSemester());

        dto.setMaxCapacity(section.getMaxCapacity());
        Double courseCredits = section.getCourse().getCredits();
        dto.setCourseCredits(courseCredits != null ? courseCredits.intValue() : 0);

        int enrolledCount = section.getCurrentEnrollments() != null ?
                (int) section.getCurrentEnrollments().stream()
                        .filter(e -> "ENROLLED".equals(e.getStatus()))
                        .count() : 0;
        dto.setEnrolledCount(enrolledCount);
        dto.setHasAvailability(enrolledCount < dto.getMaxCapacity());

        // Convert time slots
        if (section.getTimeSlots() != null) {
            dto.setTimeSlots(section.getTimeSlots().stream()
                    .map(this::convertToTimeSlotDTO)
                    .collect(Collectors.toList()));
        }

        if (student != null) {
            List<String> blockingReasons = buildBlockingReasons(student, section);
            dto.setBlockingReasons(blockingReasons);
            dto.setCanEnroll(blockingReasons.isEmpty());
        } else {
            dto.setBlockingReasons(List.of());
            dto.setCanEnroll(dto.isHasAvailability());
        }

        return dto;
    }

    private boolean isCourseGradeAppropriate(Course course, Integer studentGrade) {
        if (studentGrade == null) {
            return false;
        }
        Integer min = course.getGradeLevelMin();
        Integer max = course.getGradeLevelMax();

        if (min != null && studentGrade < min) {
            return false;
        }
        if (max != null && studentGrade > max) {
            return false;
        }
        return true;
    }

    private List<String> buildBlockingReasons(Student student, CourseSection section) {
        Course course = section.getCourse();
        List<String> reasons = new ArrayList<>();

        if (!isCourseGradeAppropriate(course, student.getGradeLevel())) {
            reasons.add("Grade level not eligible");
        }
        if (!validationService.hasPrerequisites(student, course)) {
            reasons.add("Missing prerequisite");
        }
        if (!validationService.hasCourseLimitAvailability(student)) {
            reasons.add("Maximum 5 courses already enrolled");
        }
        if (validationService.hasTimeConflict(student, section)) {
            reasons.add("Schedule conflict");
        }
        boolean alreadyEnrolledSection = currentEnrollmentRepo.existsByStudentIdAndSectionIdAndStatus(
                student.getId(), section.getId(), "ENROLLED"
        );
        if (alreadyEnrolledSection) {
            reasons.add("Already enrolled");
        }
        if (!alreadyEnrolledSection && validationService.isAlreadyEnrolledInCourse(student.getId(), course.getId())) {
            reasons.add("Already enrolled in another section of this course");
        }
        if (!validationService.hasSectionAvailability(section)) {
            reasons.add("Section is full");
        }

        return reasons;
    }

    private CourseDTO convertPrerequisiteToDTO(Course prerequisite) {
        CourseDTO prerequisiteDTO = new CourseDTO();
        prerequisiteDTO.setId(prerequisite.getId());
        prerequisiteDTO.setCode(prerequisite.getCode());
        prerequisiteDTO.setName(prerequisite.getName());
        prerequisiteDTO.setDescription(prerequisite.getDescription());
        Double credits = prerequisite.getCredits();
        prerequisiteDTO.setCredits(credits != null ? credits.intValue() : 0);
        prerequisiteDTO.setHoursPerWeek(prerequisite.getHoursPerWeek());
        prerequisiteDTO.setCourseType(prerequisite.getCourseType());
        prerequisiteDTO.setGradeLevelMin(prerequisite.getGradeLevelMin());
        prerequisiteDTO.setGradeLevelMax(prerequisite.getGradeLevelMax());
        prerequisiteDTO.setSemesterOrder(prerequisite.getSemesterOrder());
        return prerequisiteDTO;
    }

    public TimeSlotDTO convertToTimeSlotDTO(TimeSlot timeSlot) {
        TimeSlotDTO dto = new TimeSlotDTO();
        dto.setId(timeSlot.getId());
        dto.setDayOfWeek(timeSlot.getDayOfWeek());
        dto.setStartTime(timeSlot.getStartTime().toString());
        dto.setEndTime(timeSlot.getEndTime().toString());
        dto.setRoomNumber(timeSlot.getRoomNumber());
        return dto;
    }
}
