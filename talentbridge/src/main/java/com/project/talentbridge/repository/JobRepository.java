package com.project.talentbridge.repository;

import com.project.talentbridge.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job,Integer> {

    List<Job> findByRecruiters_User_Email(String email);
}
