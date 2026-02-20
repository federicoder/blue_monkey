package com.maplewood.backend.service;

import com.maplewood.backend.dto.StudentProfileDTO;
import com.maplewood.backend.exception.ResourceNotFoundException;
import com.maplewood.backend.model.Student;
import com.maplewood.backend.repository.CurrentEnrollmentRepository;
import com.maplewood.backend.repository.StudentCourseHistoryRepository;
import com.maplewood.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentProfileService {

    private final StudentRepository studentRepo;
    private final StudentCourseHistoryRepository historicalRepo;
    private final CurrentEnrollmentRepository currentRepo;

    private static final Integer REQUIRED_CREDITS = 30;

    public StudentProfileDTO getStudentProfile(Long studentId) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        StudentProfileDTO profile = new StudentProfileDTO();
        profile.setId(student.getId());
        profile.setFirstName(student.getFirstName());
        profile.setLastName(student.getLastName());
        profile.setGradeLevel(student.getGradeLevel());

        // Calculate GPA
        Double gpa = historicalRepo.calculateGPA(studentId);
        profile.setGpa(gpa != null ? Math.round(gpa * 100.0) / 100.0 : 0.0);

        // Calculate earned credits
        Double earnedCredits = historicalRepo.getTotalEarnedCredits(studentId);
        profile.setEarnedCredits(earnedCredits != null ? earnedCredits.intValue() : 0);

        // Calculate remaining credits
        profile.setRemainingCredits(Math.max(0, REQUIRED_CREDITS - profile.getEarnedCredits()));

        // Get current courses count
        Integer currentCount = currentRepo.countActiveEnrollmentsByStudentId(studentId);
        profile.setCurrentCoursesCount(currentCount != null ? currentCount : 0);

        return profile;
    }
}