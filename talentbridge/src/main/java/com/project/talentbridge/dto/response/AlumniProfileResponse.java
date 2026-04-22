package com.project.talentbridge.dto.response;

import com.project.talentbridge.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data

public class AlumniProfileResponse {
    private String name;
    private String email;
    private Role role;
    private String company;
    private String designation;
    private Integer experienceYears;
}
