package com.project.talentbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class StudentProfileResponse {
    private Integer id;
    private String name;
    private String email;
    private String role;
    private String rollNumber;
    private String department;
    private Integer year;
    private BigDecimal cgpa;
    private String resumeLink;
}
