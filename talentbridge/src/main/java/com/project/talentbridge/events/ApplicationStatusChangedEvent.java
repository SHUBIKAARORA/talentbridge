package com.project.talentbridge.events;

import com.project.talentbridge.model.ApplicationStatus;

public class ApplicationStatusChangedEvent {
    private Integer applicationId;
    private Integer studentId;
    private ApplicationStatus status;

    public ApplicationStatusChangedEvent(Integer applicationId, Integer studentId, ApplicationStatus status) {
        this.applicationId = applicationId;
        this.studentId = studentId;
        this.status = status;
    }

    public Integer getApplicationId() { return applicationId; }
    public Integer getStudentId() { return studentId; }
    public ApplicationStatus getStatus() { return status; }

}
