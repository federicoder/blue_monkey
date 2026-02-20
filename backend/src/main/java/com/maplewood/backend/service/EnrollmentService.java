package com.maplewood.backend.service;

import com.maplewood.backend.dto.*;
import com.maplewood.backend.exception.ResourceNotFoundException;
import com.maplewood.backend.model.*;
import com.maplewood.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentValidationService validationService;
    private final CurrentEnrollmentRepository currentRepo;
    private final StudentRepository studentRepo;
    private final CourseSectionRepository sectionRepo;
    private final StudentProfileService profileService;
    private final CourseCatalogService catalogService;

    public EnrollmentResponseDTO enrollStudent(EnrollmentRequestDTO request) {
        EnrollmentResponseDTO response = new EnrollmentResponseDTO();
        response.setRequest(request);

        try {
            // Validate enrollment
            ValidationResult validation = validationService.validateEnrollment(
                    request.getStudentId(),
                    request.getSectionId()
            );

            if (!validation.isValid()) {
                response.setSuccess(false);
                response.setMessage("Enrollment validation failed");
                response.setErrors(validation.getErrors());
                return response;
            }

            // Check if already enrolled
            if (currentRepo.existsByStudentIdAndSectionIdAndStatus(request.getStudentId(), request.getSectionId(), "ENROLLED")) {
                response.setSuccess(false);
                response.setMessage("Already enrolled in this course section");
                response.setErrors(List.of("Duplicate enrollment"));
                return response;
            }

            // Create enrollment
            CurrentEnrollment enrollment = new CurrentEnrollment();
            enrollment.setStudent(studentRepo.getReferenceById(request.getStudentId()));
            enrollment.setSection(sectionRepo.getReferenceById(request.getSectionId()));
            enrollment.setEnrollmentDate(LocalDateTime.now());
            enrollment.setStatus("ENROLLED");

            currentRepo.save(enrollment);

            // Update response
            response.setSuccess(true);
            response.setMessage("Successfully enrolled in course");
            response.setUpdatedStudentProfile(
                    profileService.getStudentProfile(request.getStudentId())
            );

        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Error processing enrollment: " + e.getMessage());
            response.setErrors(List.of(e.getMessage()));
        }

        return response;
    }

    public EnrollmentResponseDTO dropEnrollment(Long studentId, Long sectionId) {
        EnrollmentResponseDTO response = new EnrollmentResponseDTO();
        EnrollmentRequestDTO request = new EnrollmentRequestDTO();
        request.setStudentId(studentId);
        request.setSectionId(sectionId);
        response.setRequest(request);

        try {
            // Find the enrollment
            CurrentEnrollment enrollment = currentRepo
                    .findByStudentIdAndSectionIdAndStatus(studentId, sectionId, "ENROLLED")
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Active enrollment not found for student " + studentId + " in section " + sectionId));

            // Update status to DROPPED (soft delete)
            enrollment.setStatus("DROPPED");
            currentRepo.save(enrollment);

            response.setSuccess(true);
            response.setMessage("Successfully dropped course");
            response.setUpdatedStudentProfile(
                    profileService.getStudentProfile(studentId)
            );

        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Error dropping enrollment: " + e.getMessage());
            response.setErrors(List.of(e.getMessage()));
        }

        return response;
    }

    public ScheduleDTO getStudentSchedule(Long studentId) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        List<CurrentEnrollment> enrollments = currentRepo.findActiveEnrollmentsByStudentId(studentId);

        ScheduleDTO schedule = new ScheduleDTO();
        schedule.setStudentId(studentId);
        schedule.setStudentName(student.getFirstName() + " " + student.getLastName());

        // Create enrolled sections DTOs
        List<EnrolledSectionDTO> enrolledSections = enrollments.stream()
                .map(this::convertToEnrolledSectionDTO)
                .collect(Collectors.toList());
        schedule.setEnrolledSections(enrolledSections);

        // Organize by day for weekly view
        Map<String, List<TimeSlotDTO>> weeklySchedule = new HashMap<>();
        weeklySchedule.put("MONDAY", new ArrayList<>());
        weeklySchedule.put("TUESDAY", new ArrayList<>());
        weeklySchedule.put("WEDNESDAY", new ArrayList<>());
        weeklySchedule.put("THURSDAY", new ArrayList<>());
        weeklySchedule.put("FRIDAY", new ArrayList<>());

        for (CurrentEnrollment enrollment : enrollments) {
            CourseSection section = enrollment.getSection();
            for (TimeSlot slot : section.getTimeSlots()) {
                TimeSlotDTO slotDTO = catalogService.convertToTimeSlotDTO(slot);
                slotDTO.setCourseName(section.getCourse().getName());
                weeklySchedule.get(slot.getDayOfWeek()).add(slotDTO);
            }
        }

        // Sort time slots by start time
        weeklySchedule.forEach((day, slots) ->
                slots.sort(Comparator.comparing(TimeSlotDTO::getStartTime))
        );

        schedule.setWeeklySchedule(weeklySchedule);

        return schedule;
    }

    private EnrolledSectionDTO convertToEnrolledSectionDTO(CurrentEnrollment enrollment) {
        EnrolledSectionDTO dto = new EnrolledSectionDTO();
        dto.setEnrollmentId(enrollment.getId());
        dto.setEnrollmentDate(enrollment.getEnrollmentDate());
        dto.setSection(catalogService.convertToSectionDTO(enrollment.getSection()));
        return dto;
    }

    public List<CourseSectionDTO> getAvailableSectionsForStudent(Long studentId, String semester) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        // Get all sections for the semester
        List<CourseSection> allSections = sectionRepo.findBySemester(semester);
        boolean hasCourseLimitAvailability = validationService.hasCourseLimitAvailability(student);

        // Filter sections the student can enroll in
        return allSections.stream()
                .filter(section -> {
                    Course course = section.getCourse();

                    // Check grade level
                    boolean gradeLevelOk = isGradeLevelAppropriate(student, course);

                    // Check prerequisites
                    boolean prerequisitesOk = validationService.hasPrerequisites(student, course);

                    // Check not already enrolled
                    boolean notEnrolled = !currentRepo.existsByStudentIdAndSectionIdAndStatus(studentId, section.getId(), "ENROLLED");

                    // Check capacity
                    boolean hasSpace = validationService.hasSectionAvailability(section);

                    // Check semester max courses and time conflicts
                    boolean courseLimitOk = hasCourseLimitAvailability;
                    boolean noTimeConflict = !validationService.hasTimeConflict(student, section);

                    return gradeLevelOk && prerequisitesOk && notEnrolled && hasSpace && courseLimitOk && noTimeConflict;
                })
                .map(catalogService::convertToSectionDTO)
                .collect(Collectors.toList());
    }

    private boolean isGradeLevelAppropriate(Student student, Course course) {
        Integer studentGrade = student.getGradeLevel();
        Integer minGrade = course.getGradeLevelMin();
        Integer maxGrade = course.getGradeLevelMax();

        if (studentGrade == null) {
            return false;
        }
        if (minGrade != null && studentGrade < minGrade) {
            return false;
        }
        if (maxGrade != null && studentGrade > maxGrade) {
            return false;
        }
        return true;
    }
}
