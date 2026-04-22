package com.project.talentbridge.controller;

import com.project.talentbridge.dto.request.AddJobRequest;
import com.project.talentbridge.dto.response.ApplicantResponse;
import com.project.talentbridge.dto.response.JobResponse;
import com.project.talentbridge.dto.response.RecruiterResponse;
import com.project.talentbridge.repository.RecruiterRepository;
import com.project.talentbridge.service.ApplicationService;
import com.project.talentbridge.service.JobService;
import com.project.talentbridge.service.RecruiterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/tnp")
@CrossOrigin(origins = "http://localhost:3000")
public class TnpController {

    @Autowired
    private JobService jobService;

    @PostMapping("/jobs")
    public ResponseEntity<?> addJob(@RequestBody AddJobRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        jobService.addJob(email, request);

        return ResponseEntity.ok("Job added successfully");
    }

    @Autowired
    private RecruiterService recruiterService;

    @GetMapping("/recruiters")
    public ResponseEntity<List<RecruiterResponse>> getRecruiters() {

        List<RecruiterResponse> recruiters = recruiterService.getAllRecruiters();

        return ResponseEntity.ok(recruiters);
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponse>> getAllJobs() {

        List<JobResponse> jobs = jobService.getAllJobs();

        return ResponseEntity.ok(jobs);
    }

    // NEW — student dashboard jobs with match score
    @GetMapping("/jobs/student")
    public ResponseEntity<List<JobResponse>> getJobsForStudent(
            Authentication authentication
    ) {
        String email = authentication.getName();
        List<JobResponse> jobs = jobService.getJobsForStudent(email);
        return ResponseEntity.ok(jobs);
    }



    @Autowired
    private ApplicationService applicationService;

    @GetMapping("/jobs/{jobId}/applications")
    public ResponseEntity<List<ApplicantResponse>> getApplicants(
            @PathVariable Integer jobId
    ) {
        return ResponseEntity.ok(
                applicationService.getApplicantsForJob(jobId)
        );
    }
}