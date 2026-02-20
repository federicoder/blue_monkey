package com.maplewood.backend.model;


import com.maplewood.backend.model.converter.LocalDateTextConverter;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "semesters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Semester {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "order_in_year", nullable = false)
    private Integer orderInYear;

    @Column(name = "start_date")
    @Convert(converter = LocalDateTextConverter.class)
    private LocalDate startDate;

    @Column(name = "end_date")
    @Convert(converter = LocalDateTextConverter.class)
    private LocalDate endDate;

    @Column(name = "is_active")
    private Boolean isActive;

    @OneToMany(mappedBy = "semester")
    private List<StudentCourseHistory> historicalEnrollments;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

}
