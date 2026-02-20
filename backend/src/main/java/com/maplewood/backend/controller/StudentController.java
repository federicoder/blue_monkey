package com.maplewood.backend.controller;



import com.maplewood.backend.dto.ScheduleDTO;
import com.maplewood.backend.dto.StudentProfileDTO;
import com.maplewood.backend.service.EnrollmentService;
import com.maplewood.backend.service.StudentProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentProfileService profileService;
    private final EnrollmentService enrollmentService;

    @GetMapping("/{studentId}/profile")
    public ResponseEntity<StudentProfileDTO> getStudentProfile(@PathVariable Long studentId) {
        StudentProfileDTO profile = profileService.getStudentProfile(studentId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/{studentId}/schedule")
    public ResponseEntity<ScheduleDTO> getStudentSchedule(@PathVariable Long studentId) {
        ScheduleDTO schedule = enrollmentService.getStudentSchedule(studentId);
        return ResponseEntity.ok(schedule);
    }
}