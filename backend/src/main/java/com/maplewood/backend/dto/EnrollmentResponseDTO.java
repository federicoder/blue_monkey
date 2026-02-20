package com.maplewood.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
public class EnrollmentResponseDTO {
    private boolean success;
    private String message;
    private EnrollmentRequestDTO request;
    private List<String> errors;
    private StudentProfileDTO updatedStudentProfile;

}