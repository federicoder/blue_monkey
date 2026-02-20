package com.maplewood.backend.controller;


import com.maplewood.backend.model.Semester;
import com.maplewood.backend.repository.SemesterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/semesters")
@RequiredArgsConstructor
public class SemesterController {

    private final SemesterRepository semesterRepository;

    @GetMapping("/current")
    public ResponseEntity<Semester> getCurrentSemester() {
        Semester current = semesterRepository.findFirstByIsActiveTrueOrderByYearDescOrderInYearDesc()
                .orElseGet(() -> semesterRepository.findFirstByOrderByYearDescOrderInYearDesc().orElse(null));

        if (current == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(current);
    }

    @GetMapping
    public ResponseEntity<List<Semester>> getAllSemesters() {
        return ResponseEntity.ok(semesterRepository.findAll());
    }
}
