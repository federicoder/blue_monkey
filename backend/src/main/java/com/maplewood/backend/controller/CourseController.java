package com.maplewood.backend.controller;

import com.maplewood.backend.dto.CourseDTO;
import com.maplewood.backend.model.Course;
import com.maplewood.backend.repository.CourseRepository;
import com.maplewood.backend.service.CourseCatalogService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
public class CourseController {

    private final CourseCatalogService catalogService;

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        return ResponseEntity.ok(catalogService.getAllCourses());
    }

    @GetMapping("/available")
    public ResponseEntity<List<CourseDTO>> getAvailableCourses(
            @RequestParam Long studentId,
            @RequestParam String semester) {
        return ResponseEntity.ok(
                catalogService.getAvailableCoursesForStudent(studentId, semester)
        );
    }
}
