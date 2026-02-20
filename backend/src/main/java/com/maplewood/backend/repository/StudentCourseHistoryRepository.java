package com.maplewood.backend.repository;

import com.maplewood.backend.model.StudentCourseHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentCourseHistoryRepository extends JpaRepository<StudentCourseHistory, Long> {

    List<StudentCourseHistory> findByStudentId(Long studentId);

    // Corsi passati (status = 'passed')
    @Query("SELECT h FROM StudentCourseHistory h " +
            "WHERE h.student.id = :studentId AND h.status = 'passed'")
    List<StudentCourseHistory> findPassedCoursesByStudentId(@Param("studentId") Long studentId);

    // Calcola crediti ottenuti (solo corsi passati)
    @Query("SELECT SUM(c.credits) FROM StudentCourseHistory h " +
            "JOIN h.course c " +
            "WHERE h.student.id = :studentId AND h.status = 'passed'")
    Double getTotalEarnedCredits(@Param("studentId") Long studentId);

    // Calcola GPA (basato su passed/failed - passed = 4.0, failed = 0.0)
    @Query("SELECT AVG(CASE h.status WHEN 'passed' THEN 4.0 ELSE 0.0 END) " +
            "FROM StudentCourseHistory h " +
            "WHERE h.student.id = :studentId")
    Double calculateGPA(@Param("studentId") Long studentId);
}