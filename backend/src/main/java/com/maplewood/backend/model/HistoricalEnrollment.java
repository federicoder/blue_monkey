package com.maplewood.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "historical_enrollments")
@Data
public class HistoricalEnrollment {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    private String grade; // A, B, C, etc.
    private Double numericGrade; // [30 - 18].
    private Integer academicYear;
    private String semester;

}