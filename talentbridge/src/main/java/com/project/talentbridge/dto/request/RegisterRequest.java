package com.project.talentbridge.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;

    // Student fields
    private String rollNumber;
    private String department;
    private Integer year;
    private BigDecimal cgpa;
    private String resumeLink;

    // Alumni fields
    private String company;
    private String designation;
    private Integer experienceYears;
}
