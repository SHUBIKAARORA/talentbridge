package com.project.talentbridge.controller;

import com.project.talentbridge.dto.request.AddExperienceRequest;
import com.project.talentbridge.dto.response.ExperienceResponse;
import com.project.talentbridge.service.AlumniExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumni")
@CrossOrigin(origins = "http://localhost:3000")
public class AlumniExperienceController {
    @Autowired
    private AlumniExperienceService experienceService;

    @PostMapping("/experiences")
    public ResponseEntity<?> addExperience(
            @RequestBody AddExperienceRequest request
    ) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        experienceService.addExperience(email, request);

        return ResponseEntity.ok("Experience added successfully");
    }

    @GetMapping("/experiences")
    public ResponseEntity<List<ExperienceResponse>> getExperiences(
            @RequestParam(required = false) String company
    ) {

        List<ExperienceResponse> experiences =
                experienceService.getAllExperiences(company);

        return ResponseEntity.ok(experiences);
    }
}
