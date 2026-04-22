package com.project.talentbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class RecruiterProfileResponse {

    private String name;
    private String email;
    private String role;
    private String company;
    private String designation;
}