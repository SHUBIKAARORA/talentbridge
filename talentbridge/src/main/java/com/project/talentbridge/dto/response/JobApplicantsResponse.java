package com.project.talentbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class JobApplicantsResponse {
    private Integer jobId;
    private String title;
    private String company;

    private List<ApplicantResponse> applicants;
}
