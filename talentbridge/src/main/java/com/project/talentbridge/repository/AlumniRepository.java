package com.project.talentbridge.repository;

import com.project.talentbridge.model.Alumni;
import com.project.talentbridge.model.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlumniRepository extends JpaRepository<Alumni,Integer> {
    Optional<Alumni> findByUser_Email(String email);
    Optional<Alumni> findByUser_UserId(int userId);
}
