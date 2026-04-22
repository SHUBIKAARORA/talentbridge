package com.project.talentbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CompanyWiseDTO {
    private String company;
    private long hires;
}
