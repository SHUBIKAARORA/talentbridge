package com.project.talentbridge.controller;

import com.project.talentbridge.dto.request.StatusUpdateRequest;
import com.project.talentbridge.dto.request.UpdateRecruiterProfileRequest;
import com.project.talentbridge.dto.response.JobApplicantsResponse;
import com.project.talentbridge.dto.response.JobResponse;
import com.project.talentbridge.dto.response.RecruiterProfileResponse;
import com.project.talentbridge.model.Job;
import com.project.talentbridge.model.Recruiter;
import com.project.talentbridge.model.Users;
import com.project.talentbridge.repository.JobRepository;
import com.project.talentbridge.repository.RecruiterRepository;
import com.project.talentbridge.service.ApplicationService;
import com.project.talentbridge.service.JobService;
import com.project.talentbridge.service.RecruiterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
@CrossOrigin(origins = "http://localhost:3000")
public class RecruiterController {
    @Autowired
    private JobService jobService;

    @Autowired
    ApplicationService applicationService;

    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponse>> getMyJobs() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return ResponseEntity.ok(
                jobService.getJobsForRecruiter(email)
        );
    }

    @GetMapping("/applications")
    public ResponseEntity<List<JobApplicantsResponse>> getApplications(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                applicationService.getRecruiterApplications(email)
        );
    }

    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Integer applicationId,
            @RequestBody StatusUpdateRequest request
    ) {

        applicationService.updateApplicationStatus(
                applicationId,
                request.getStatus()
        );

        return ResponseEntity.ok("Status updated");
    }

    @Autowired
    private RecruiterService recruiterService;

    // ✅ GET PROFILE
    @GetMapping("/profile")
    public RecruiterProfileResponse getProfile(Authentication authentication) {

        User userDetails = (User) authentication.getPrincipal();

        String email = userDetails.getUsername(); // email

        return recruiterService.getRecruiterProfileByEmail(email);
    }

    // ✅ UPDATE PROFILE
    @PutMapping("/profile")
    public String updateProfile(@RequestBody UpdateRecruiterProfileRequest request,
                                Authentication authentication) {

        User userDetails = (User) authentication.getPrincipal();

        String email = userDetails.getUsername();

        recruiterService.updateRecruiterProfileByEmail(email, request);

        return "Profile updated successfully";
    }
}
