package com.project.talentbridge.repository;

import com.project.talentbridge.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application,Integer> {
    List<Application> findByStudent_User_Email(String email);

    Optional<Application> findByStudent_User_EmailAndJob_JobId(String email, Integer jobId);

    List<Application> findByJob_JobId(Integer jobId);

    @Query("""
SELECT COUNT(DISTINCT a.student.studentId)
FROM Application a
WHERE a.status = 'SELECTED'
""")
    long countPlacedStudents();

    @Query("""
SELECT s.department, COUNT(DISTINCT s.studentId)
FROM Application a
JOIN a.student s
WHERE a.status = 'SELECTED'
GROUP BY s.department
""")
    List<Object[]> getDepartmentWisePlacement();

    @Query("""
SELECT j.company, COUNT(DISTINCT a.student.studentId)
FROM Application a
JOIN a.job j
WHERE a.status = 'SELECTED'
GROUP BY j.company
""")
    List<Object[]> getCompanyWiseHiring();

    @Query("""
SELECT a.status, COUNT(a)
FROM Application a
GROUP BY a.status
""")
    List<Object[]> getStatusCounts();

    @Query("""
SELECT DATE(a.appliedAt), COUNT(a)
FROM Application a
GROUP BY DATE(a.appliedAt)
ORDER BY DATE(a.appliedAt)
""")
    List<Object[]> getApplicationsOverTime();
}
