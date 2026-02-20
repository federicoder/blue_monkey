package com.maplewood.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TimeSlotDTO {
    private Long id;
    private String courseName;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private String roomNumber;

}
