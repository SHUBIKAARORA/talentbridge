package com.project.talentbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExperienceResponse {

    private Integer experienceId;
    private String company;
    private String role;
    private Integer roundsCount;
    private String overallExperience;
    private String experienceDescription;

    private String alumniName;
    private String currentCompany;
    private String designation;
}
