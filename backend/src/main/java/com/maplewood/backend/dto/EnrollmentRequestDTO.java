package com.maplewood.backend.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EnrollmentRequestDTO {
    private Long studentId;
    private Long sectionId;

}