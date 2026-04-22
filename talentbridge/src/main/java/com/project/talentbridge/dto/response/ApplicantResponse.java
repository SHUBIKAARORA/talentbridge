package com.project.talentbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ApplicantResponse {
    private Integer applicationId;

    private String name;
    private String email;

    private String rollNumber;
    private String department;
    private BigDecimal cgpa;

    private String resumeLink;

    private String status;

    private BigDecimal matchScore;
}
