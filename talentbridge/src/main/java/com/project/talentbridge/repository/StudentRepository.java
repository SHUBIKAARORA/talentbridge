package com.project.talentbridge.repository;

import com.project.talentbridge.model.Recruiter;
import com.project.talentbridge.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByUser_Email(String email);
    Optional<Student> findByUser_UserId(int userId);
}
