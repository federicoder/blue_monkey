package com.maplewood.backend.repository;

import com.maplewood.backend.model.CurrentEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Repository
public interface CurrentEnrollmentRepository extends JpaRepository<CurrentEnrollment, Long> {

    List<CurrentEnrollment> findByStudentId(Long studentId);

    @Query("SELECT ce FROM CurrentEnrollment ce " +
            "WHERE ce.student.id = :studentId AND ce.status = 'ENROLLED'")
    List<CurrentEnrollment> findActiveEnrollmentsByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(ce) FROM CurrentEnrollment ce " +
            "WHERE ce.student.id = :studentId AND ce.status = 'ENROLLED'")
    Integer countActiveEnrollmentsByStudentId(@Param("studentId") Long studentId);

    boolean existsByStudentIdAndSectionId(Long studentId, Long sectionId);
    boolean existsByStudentIdAndSectionIdAndStatus(Long studentId, Long sectionId, String status);

    @Query("SELECT ce FROM CurrentEnrollment ce " +
            "WHERE ce.student.id = :studentId AND ce.section.id = :sectionId AND ce.status = :status")
    Optional<CurrentEnrollment> findByStudentIdAndSectionIdAndStatus(
            @Param("studentId") Long studentId,
            @Param("sectionId") Long sectionId,
            @Param("status") String status);

    @Query("SELECT COUNT(ce) FROM CurrentEnrollment ce " +
            "WHERE ce.section.id = :sectionId AND ce.status = :status")
    Integer countBySectionIdAndStatus(@Param("sectionId") Long sectionId, @Param("status") String status);

    @Query("SELECT CASE WHEN COUNT(ce) > 0 THEN true ELSE false END " +
            "FROM CurrentEnrollment ce " +
            "WHERE ce.student.id = :studentId " +
            "AND ce.section.course.id = :courseId " +
            "AND ce.status = 'ENROLLED'")
    boolean existsActiveEnrollmentByStudentIdAndCourseId(
            @Param("studentId") Long studentId,
            @Param("courseId") Long courseId);
}
