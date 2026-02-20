package com.maplewood.backend.service;

import com.maplewood.backend.model.*;
import com.maplewood.backend.repository.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class EnrollmentValidationService {

    private final StudentRepository studentRepo;
    private final CourseSectionRepository sectionRepo;
    private final StudentCourseHistoryRepository historicalRepo; // Cambiato da HistoricalEnrollmentRepository
    private final CurrentEnrollmentRepository currentRepo;

    private static final int MAX_COURSES_PER_SEMESTER = 5;

    public ValidationResult validateEnrollment(Long studentId, Long sectionId) {
        List<String> errors = new ArrayList<>();

        // Get student and section details
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        CourseSection section = sectionRepo.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Course section not found with id: " + sectionId));

        Course course = section.getCourse();

        // 1. Check grade level
        if (!isGradeLevelAppropriate(student, course)) {
            errors.add("Course not appropriate for grade level " + student.getGradeLevel());
        }

        // 2. Check prerequisites
        if (!hasPrerequisites(student, course)) {
            errors.add("Missing prerequisites for this course");
        }

        // 3. Check course limit
        if (!hasCourseLimitAvailability(student)) {
            errors.add("Maximum courses (" + MAX_COURSES_PER_SEMESTER + ") already enrolled");
        }

        // 4. Check time conflicts
        if (hasTimeConflict(student, section)) {
            errors.add("Schedule conflict with existing enrollment");
        }

        // 5. Check if already enrolled
        boolean alreadyEnrolledInSection = isAlreadyEnrolled(studentId, sectionId);
        if (alreadyEnrolledInSection) {
            errors.add("Already enrolled in this course section");
        }

        // 6. Check if already enrolled in another section of the same course
        if (!alreadyEnrolledInSection && isAlreadyEnrolledInCourse(studentId, course.getId())) {
            errors.add("Already enrolled in this course (another section)");
        }

        // 7. Check section capacity
        if (!hasSectionAvailability(section)) {
            errors.add("Course section is at maximum capacity");
        }

        return new ValidationResult(errors.isEmpty(), errors);
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

    boolean hasPrerequisites(Student student, Course course) {
        // Usa prerequisite_id invece di una lista di prerequisites
        Course prerequisite = course.getPrerequisite();
        if (prerequisite == null) {
            return true;
        }

        // Verifica se lo studente ha passato il prerequisito
        List<StudentCourseHistory> passedCourses = historicalRepo.findPassedCoursesByStudentId(student.getId());

        return passedCourses.stream()
                .anyMatch(history -> history.getCourse().getId().equals(prerequisite.getId()));
    }
    public boolean hasCourseLimitAvailability(Student student) {
        Integer currentCount = currentRepo.countActiveEnrollmentsByStudentId(student.getId());
        return currentCount < MAX_COURSES_PER_SEMESTER;
    }

    public boolean hasTimeConflict(Student student, CourseSection newSection) {
        List<CurrentEnrollment> currentEnrollments =
                currentRepo.findActiveEnrollmentsByStudentId(student.getId());

        List<TimeSlot> newTimeSlots = newSection.getTimeSlots();
        if (newTimeSlots == null || newTimeSlots.isEmpty()) {
            return false;
        }

        for (CurrentEnrollment enrollment : currentEnrollments) {
            CourseSection existingSection = enrollment.getSection();
            List<TimeSlot> existingTimeSlots = existingSection.getTimeSlots();
            if (existingTimeSlots == null || existingTimeSlots.isEmpty()) {
                continue;
            }

            for (TimeSlot existingSlot : existingTimeSlots) {
                for (TimeSlot newSlot : newTimeSlots) {
                    if (timeSlotsOverlap(existingSlot, newSlot)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private boolean timeSlotsOverlap(TimeSlot slot1, TimeSlot slot2) {
        if (!slot1.getDayOfWeek().equals(slot2.getDayOfWeek())) {
            return false;
        }
        return slot1.getStartTime().isBefore(slot2.getEndTime()) &&
                slot2.getStartTime().isBefore(slot1.getEndTime());
    }

    private boolean isAlreadyEnrolled(Long studentId, Long sectionId) {
        return currentRepo.existsByStudentIdAndSectionIdAndStatus(studentId, sectionId, "ENROLLED");
    }

    public boolean isAlreadyEnrolledInCourse(Long studentId, Long courseId) {
        return currentRepo.existsActiveEnrollmentByStudentIdAndCourseId(studentId, courseId);
    }

    boolean hasSectionAvailability(CourseSection section) {
        int enrolledCount = currentRepo.countBySectionIdAndStatus(section.getId(), "ENROLLED");
        return enrolledCount < section.getMaxCapacity();
    }
}

@Data
@AllArgsConstructor
class ValidationResult {
    private final boolean valid;
    private final List<String> errors;
}
