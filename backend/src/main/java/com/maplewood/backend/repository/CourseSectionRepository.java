package com.maplewood.backend.repository;

import com.maplewood.backend.model.CourseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface CourseSectionRepository extends JpaRepository<CourseSection, Long> {
    List<CourseSection> findBySemester(String semester);
    List<CourseSection> findByCourseIdAndSemester(Long courseId, String semester);

    @Query("SELECT cs FROM CourseSection cs " +
            "JOIN cs.timeSlots ts " +
            "WHERE ts.dayOfWeek = :dayOfWeek AND ts.startTime >= :startTime")
    List<CourseSection> findSectionsByTimeSlot(String dayOfWeek, LocalTime startTime);
}