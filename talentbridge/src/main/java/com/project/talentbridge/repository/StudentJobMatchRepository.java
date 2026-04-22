package com.project.talentbridge.repository;

import com.project.talentbridge.model.StudentJobMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentJobMatchRepository extends JpaRepository<StudentJobMatch, Long> {

    // Used by React job cards — get match score for one student across all jobs
    List<StudentJobMatch> findByStudentId(Integer studentId);

    // Used by recruiter view — get all students matched to a specific job
    List<StudentJobMatch> findByJobId(Integer jobId);

    // Used to avoid duplicate entries
    Optional<StudentJobMatch> findByStudentIdAndJobId(Integer studentId, Integer jobId);

    // Used by recruiter filter (>85% etc)
    List<StudentJobMatch> findByJobIdAndMatchScoreGreaterThanEqual(
            Integer jobId, java.math.BigDecimal threshold
    );
}
