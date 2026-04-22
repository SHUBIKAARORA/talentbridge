package com.project.talentbridge.dto.request;


import lombok.Data;

import java.math.BigDecimal;

@Data

public class UpdateStudentProfileRequest {
    private String rollNumber;
    private String department;
    private Integer year;
    private BigDecimal cgpa;
    private String resumeLink;
}
