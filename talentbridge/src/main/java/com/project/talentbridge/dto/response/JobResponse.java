package com.project.talentbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobResponse {

    private Integer jobId;
    private String title;
    private String company;
    private String description;
    private String eligibilityCriteria;
    private String jdLink;
    private LocalDate lastDate;
    private LocalDateTime createdAt;
    private BigDecimal matchScore;
}