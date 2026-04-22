package com.project.talentbridge.service;


import com.project.talentbridge.dto.request.UpdateRecruiterProfileRequest;
import com.project.talentbridge.dto.response.RecruiterProfileResponse;
import com.project.talentbridge.dto.response.RecruiterResponse;
import com.project.talentbridge.model.Recruiter;
import com.project.talentbridge.model.Users;
import com.project.talentbridge.repository.RecruiterRepository;
import com.project.talentbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecruiterService {
    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private UserRepository userRepository;

    public List<RecruiterResponse> getAllRecruiters() {

        List<Recruiter> recruiters = recruiterRepository.findAll();

        return recruiters.stream()
                .map(rec -> new RecruiterResponse(
                        rec.getRecruiterId(),
                        rec.getUser().getName(),
                        rec.getCompany()
                ))
                .collect(Collectors.toList());
    }

    public RecruiterProfileResponse getRecruiterProfile(int userId) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Recruiter recruiter = recruiterRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        return new RecruiterProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getRole().toString(),
                recruiter.getCompany(),
                recruiter.getDesignation()
        );
    }

    public RecruiterProfileResponse getRecruiterProfileByEmail(String email) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Recruiter recruiter = recruiterRepository
                .findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        return new RecruiterProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getRole().toString(),
                recruiter.getCompany(),
                recruiter.getDesignation()
        );
    }

    // ✅ UPDATE PROFILE
    public void updateRecruiterProfileByEmail(String email,
                                              UpdateRecruiterProfileRequest request) {

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Recruiter recruiter = recruiterRepository
                .findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        recruiter.setCompany(request.getCompany());
        recruiter.setDesignation(request.getDesignation());

        recruiterRepository.save(recruiter);
    }
}
