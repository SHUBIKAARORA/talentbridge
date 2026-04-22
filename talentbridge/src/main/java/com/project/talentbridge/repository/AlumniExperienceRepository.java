package com.project.talentbridge.repository;

import com.project.talentbridge.model.AlumniExperience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlumniExperienceRepository
        extends JpaRepository<AlumniExperience,Integer> {
    List<AlumniExperience> findByCompanyContainingIgnoreCase(String company);
}
