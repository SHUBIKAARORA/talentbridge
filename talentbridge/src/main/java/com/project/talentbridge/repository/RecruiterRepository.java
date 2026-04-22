package com.project.talentbridge.repository;

import com.project.talentbridge.model.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface RecruiterRepository extends JpaRepository<Recruiter,Integer> {
    Optional<Recruiter> findByUser_UserId(int userId);
}
