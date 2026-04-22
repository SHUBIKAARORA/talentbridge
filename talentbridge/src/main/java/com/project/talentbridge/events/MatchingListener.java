package com.project.talentbridge.events;

import com.project.talentbridge.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class MatchingListener {

    @Autowired
    private MatchingService matchingService;

    @Async  // runs in background so job posting API responds instantly
    @EventListener
    public void handleJobCreated(JobCreatedEvent event) {
        System.out.println("Matching triggered for job: " + event.getJobId());
        matchingService.computeMatchesForJob(event.getJobId());
        System.out.println("Matching completed for job: " + event.getJobId());
    }
}
