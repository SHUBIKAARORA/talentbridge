package com.project.talentbridge.service;

import com.project.talentbridge.dto.request.AddExperienceRequest;
import com.project.talentbridge.dto.response.ExperienceResponse;
import com.project.talentbridge.model.Alumni;
import com.project.talentbridge.model.AlumniExperience;
import com.project.talentbridge.model.OverallExperience;
import com.project.talentbridge.repository.AlumniExperienceRepository;
import com.project.talentbridge.repository.AlumniRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlumniExperienceService {
    @Autowired
    private AlumniRepository alumniRepository;

    @Autowired
    private AlumniExperienceRepository experienceRepository;

    public void addExperience(String email, AddExperienceRequest request) {

        Alumni alumni = alumniRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Alumni not found"));

        AlumniExperience experience = new AlumniExperience();

        experience.setAlumni(alumni);
        experience.setCompany(request.getCompany());
        experience.setRole(request.getRole());
        experience.setRoundsCount(request.getRoundsCount());
        experience.setExperienceDescription(request.getExperienceDescription());

        if (request.getOverallExperience() != null &&
                !request.getOverallExperience().isEmpty()) {

            experience.setOverallExperience(
                    OverallExperience.valueOf(
                            request.getOverallExperience().toLowerCase()
                    )
            );
        }

        experienceRepository.save(experience);
    }

    public List<ExperienceResponse> getAllExperiences(String company) {

        List<AlumniExperience> experiences;

        if (company != null && !company.isEmpty()) {
            experiences = experienceRepository
                    .findByCompanyContainingIgnoreCase(company);
        } else {
            experiences = experienceRepository.findAll();
        }

        return experiences.stream().map(exp -> {

            Alumni alumni = exp.getAlumni();

            return new ExperienceResponse(
                    exp.getExperienceId(),
                    exp.getCompany(),
                    exp.getRole(),
                    exp.getRoundsCount(),
                    exp.getOverallExperience() != null
                            ? exp.getOverallExperience().name()
                            : null,
                    exp.getExperienceDescription(),
                    alumni.getUser().getName(),
                    alumni.getCompany(),
                    alumni.getDesignation()
            );

        }).collect(Collectors.toList());
    }
}
