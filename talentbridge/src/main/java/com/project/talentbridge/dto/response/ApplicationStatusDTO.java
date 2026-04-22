package com.project.talentbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApplicationStatusDTO {
    private String status;
    private long count;
}
