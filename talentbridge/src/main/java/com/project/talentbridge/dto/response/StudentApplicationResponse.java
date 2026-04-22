package com.project.talentbridge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class StudentApplicationResponse {
    private Integer applicationId;
    private Integer jobId;

    private String title;
    private String company;

    private String status;

    private LocalDateTime appliedAt;
}
