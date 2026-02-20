package com.maplewood.backend.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
public class ScheduleDTO {
    private Long studentId;
    private String studentName;
    private List<EnrolledSectionDTO> enrolledSections;
    private Map<String, List<TimeSlotDTO>> weeklySchedule; // Organized by day

}
