package com.maplewood.backend.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
public class EnrolledSectionDTO {
    private Long enrollmentId;
    private CourseSectionDTO section;
    private LocalDateTime enrollmentDate;

}