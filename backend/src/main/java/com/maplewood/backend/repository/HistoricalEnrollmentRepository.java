package com.maplewood.backend.repository;

import com.maplewood.backend.model.HistoricalEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoricalEnrollmentRepository extends JpaRepository<HistoricalEnrollment, Long> {
    List<HistoricalEnrollment> findByStudentId(Long studentId);

    @Query("SELECT he FROM HistoricalEnrollment he " +
            "WHERE he.student.id = :studentId AND he.numericGrade >= :passingGrade")
    List<HistoricalEnrollment> findPassedCoursesByStudentId(Long studentId, Double passingGrade);

    @Query("SELECT SUM(c.credits) FROM HistoricalEnrollment he " +
            "JOIN he.course c " +
            "WHERE he.student.id = :studentId AND he.numericGrade >= :passingGrade")
    Integer getTotalEarnedCredits(Long studentId, Double passingGrade);

    @Query("SELECT AVG(he.numericGrade) FROM HistoricalEnrollment he " +
            "WHERE he.student.id = :studentId")
    Double calculateGPA(Long studentId);
}