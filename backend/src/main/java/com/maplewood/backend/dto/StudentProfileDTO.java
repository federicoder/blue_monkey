package com.maplewood.backend.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StudentProfileDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private Integer gradeLevel;
    private Double gpa;
    private Integer earnedCredits;
    private Integer remainingCredits;
    private Integer currentCoursesCount;

}