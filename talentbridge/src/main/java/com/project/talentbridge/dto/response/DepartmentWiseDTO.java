package com.project.talentbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DepartmentWiseDTO {
    private String department;
    private long count;
}
