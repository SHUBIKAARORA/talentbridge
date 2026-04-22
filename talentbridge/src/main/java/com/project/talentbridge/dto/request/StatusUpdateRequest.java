package com.project.talentbridge.dto.request;

import com.project.talentbridge.model.ApplicationStatus;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    private ApplicationStatus status;
}
