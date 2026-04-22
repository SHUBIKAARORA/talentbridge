package com.project.talentbridge.events;

import java.util.List;

public class JobCreatedEvent {
    private Integer jobId;
    private List<Integer> recruiterIds;

    public JobCreatedEvent(Integer jobId, List<Integer> recruiterIds) {
        this.jobId = jobId;
        this.recruiterIds = recruiterIds;
    }

    public Integer getJobId() { return jobId; }
    public List<Integer> getRecruiterIds() { return recruiterIds; }
}
