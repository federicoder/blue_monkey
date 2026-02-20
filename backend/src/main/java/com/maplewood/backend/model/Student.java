package com.maplewood.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {
    @Id
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "grade_level")
    private Integer gradeLevel;

    @OneToMany(mappedBy = "student")
    private List<StudentCourseHistory> historicalEnrollments;

    @OneToMany(mappedBy = "student")
    private List<CurrentEnrollment> currentEnrollments;
}