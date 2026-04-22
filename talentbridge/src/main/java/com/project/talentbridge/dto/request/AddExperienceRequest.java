package com.project.talentbridge.dto.request;

import lombok.Data;

@Data
public class AddExperienceRequest {
    private String company;
    private String role;
    private Integer roundsCount;
    private String experienceDescription;
    private String overallExperience;
}
