package com.project.talentbridge.controller;

import com.project.talentbridge.dto.request.UpdateAlumniProfileRequest;
import com.project.talentbridge.dto.response.AlumniProfileResponse;
import com.project.talentbridge.service.AlumniService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/alumni")
@CrossOrigin(origins = "http://localhost:3000")
public class AlumniController {

    @Autowired
    private AlumniService alumniService;

    @GetMapping("/profile")
    public ResponseEntity<AlumniProfileResponse> getProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        AlumniProfileResponse profile =
                alumniService.getMyProfile(email);

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateAlumniProfileRequest request
    ) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        alumniService.updateMyProfile(email, request);

        return ResponseEntity.ok("Profile updated successfully");
    }
}
