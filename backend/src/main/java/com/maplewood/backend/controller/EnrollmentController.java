package com.maplewood.backend.controller;

import com.maplewood.backend.dto.EnrollmentRequestDTO;
import com.maplewood.backend.dto.EnrollmentResponseDTO;
import com.maplewood.backend.dto.CourseSectionDTO;
import com.maplewood.backend.service.EnrollmentService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    public ResponseEntity<EnrollmentResponseDTO> enroll(
            @RequestBody EnrollmentRequestDTO request) {
        EnrollmentResponseDTO response = enrollmentService.enrollStudent(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{studentId}/{sectionId}")
    public ResponseEntity<EnrollmentResponseDTO> dropEnrollment(
            @PathVariable Long studentId,
            @PathVariable Long sectionId) {
        EnrollmentResponseDTO response = enrollmentService.dropEnrollment(studentId, sectionId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/available-sections")
    public ResponseEntity<List<CourseSectionDTO>> getAvailableSections(
            @RequestParam Long studentId,
            @RequestParam String semester) {
        return ResponseEntity.ok(enrollmentService.getAvailableSectionsForStudent(studentId, semester));
    }
}
