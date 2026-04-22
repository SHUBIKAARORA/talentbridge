package com.project.talentbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecruiterResponse {
    private Integer id;
    private String name;
    private String company;
}
