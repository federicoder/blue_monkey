package com.maplewood.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "course_sections")
@Getter
@Setter

public class CourseSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(name = "semester", nullable = false)
    private String semester;

    @Column(name = "academic_year")
    private Integer academicYear;

    @Column(name = "section_code")
    private String sectionCode;

    @Column(name = "max_capacity")
    private Integer maxCapacity;

    @OneToMany(mappedBy = "section")
    private List<TimeSlot> timeSlots;

    @OneToMany(mappedBy = "section")
    private List<CurrentEnrollment> currentEnrollments;
}
