package com.maplewood.backend.repository;

import com.maplewood.backend.model.Semester;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SemesterRepository extends JpaRepository<Semester, Long> {
    Optional<Semester> findFirstByIsActiveTrueOrderByYearDescOrderInYearDesc();
    Optional<Semester> findFirstByOrderByYearDescOrderInYearDesc();
}
