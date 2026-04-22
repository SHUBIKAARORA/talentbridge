package com.project.talentbridge.service;


import com.project.talentbridge.dto.request.UpdateAlumniProfileRequest;
import com.project.talentbridge.dto.response.AlumniProfileResponse;
import com.project.talentbridge.model.Alumni;
import com.project.talentbridge.model.Users;
import com.project.talentbridge.repository.AlumniRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AlumniService {
    @Autowired
    private AlumniRepository alumniRepository;

    public AlumniProfileResponse getMyProfile(String email) {

        Alumni alumni = alumniRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Alumni profile not found"));

        Users user = alumni.getUser();

        return new AlumniProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getRole(),
                alumni.getCompany(),
                alumni.getDesignation(),
                alumni.getExperienceYears()
        );
    }

    public void updateMyProfile(
            String email,
            UpdateAlumniProfileRequest request
    ) {

        Alumni alumni = alumniRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Alumni profile not found"));

        alumni.setCompany(request.getCompany());
        alumni.setDesignation(request.getDesignation());
        alumni.setExperienceYears(request.getExperienceYears());

        alumniRepository.save(alumni);
    }
}
