package com.maplewood.backend.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class CourseSectionDTO {
    private Long id;
    private Long courseId;
    private String courseName;
    private String sectionCode;
    private String semester;
    private List<TimeSlotDTO> timeSlots;
    private Integer enrolledCount;
    private Integer maxCapacity;
    private Integer courseCredits;
    private boolean hasAvailability;
    private boolean canEnroll;
    private List<String> blockingReasons;

    // Constructors, getters, setters
}
