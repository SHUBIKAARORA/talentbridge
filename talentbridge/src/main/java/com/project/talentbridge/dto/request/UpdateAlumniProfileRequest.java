package com.project.talentbridge.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class UpdateAlumniProfileRequest {
    private String company;
    private String designation;
    private Integer experienceYears;
}
