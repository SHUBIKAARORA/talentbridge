package com.project.talentbridge.service;

import com.project.talentbridge.dto.response.ApplicantResponse;
import com.project.talentbridge.dto.response.JobApplicantsResponse;
import com.project.talentbridge.dto.response.StudentApplicationResponse;
import com.project.talentbridge.events.ApplicationStatusChangedEvent;
import com.project.talentbridge.model.*;
import com.project.talentbridge.repository.ApplicationRepository;
import com.project.talentbridge.repository.JobRepository;
import com.project.talentbridge.repository.StudentJobMatchRepository;
import com.project.talentbridge.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private StudentJobMatchRepository matchRepository; // NEW

    // 🔹 Apply to job — UNCHANGED
    public void applyToJob(String email, Integer jobId) {

        Student student = studentRepository
                .findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        boolean alreadyApplied = applicationRepository
                .findByStudent_User_EmailAndJob_JobId(email, jobId)
                .isPresent();

        if (alreadyApplied) {
            throw new RuntimeException("You have already applied to this job");
        }

        Application application = new Application();
        application.setStudent(student);
        application.setJob(job);
        application.setStatus(ApplicationStatus.applied);

        applicationRepository.save(application);
    }

    // 🔹 Get all applications of logged-in student — UNCHANGED
    public List<Application> getStudentApplications(String email) {
        return applicationRepository.findByStudent_User_Email(email);
    }

    // 🔹 Get applicants for a job — NOW INCLUDES matchScore
    public List<ApplicantResponse> getApplicantsForJob(Integer jobId) {

        List<Application> applications =
                applicationRepository.findByJob_JobId(jobId);

        // Fetch all match scores for this job in one DB call
        // Build map of studentId -> matchScore for quick lookup
        Map<Integer, BigDecimal> scoreMap = matchRepository
                .findByJobId(jobId)
                .stream()
                .collect(Collectors.toMap(
                        StudentJobMatch::getStudentId,
                        StudentJobMatch::getMatchScore
                ));

        return applications.stream()
                .map(app -> {
                    Student student = app.getStudent();
                    Users user = student.getUser();

                    // Look up match score for this student — null if not computed
                    BigDecimal matchScore = scoreMap.getOrDefault(
                            student.getStudentId(), null
                    );

                    return new ApplicantResponse(
                            app.getApplicationId(),
                            user.getName(),
                            user.getEmail(),
                            student.getRollNumber(),
                            student.getDepartment(),
                            student.getCgpa(),
                            student.getResumeLink(),
                            app.getStatus().toString(),
                            matchScore // NEW
                    );
                })
                .toList();
    }

    // 🔹 Get recruiter applications — NOW INCLUDES matchScore
    public List<JobApplicantsResponse> getRecruiterApplications(String email) {

        List<Job> jobs = jobRepository.findByRecruiters_User_Email(email);

        return jobs.stream().map(job -> {

            List<Application> applications =
                    applicationRepository.findByJob_JobId(job.getJobId());

            // Fetch match scores for this job in one DB call
            Map<Integer, BigDecimal> scoreMap = matchRepository
                    .findByJobId(job.getJobId())
                    .stream()
                    .collect(Collectors.toMap(
                            StudentJobMatch::getStudentId,
                            StudentJobMatch::getMatchScore
                    ));

            List<ApplicantResponse> applicants = applications.stream()
                    .map(app -> {
                        Student student = app.getStudent();
                        Users user = student.getUser();

                        BigDecimal matchScore = scoreMap.getOrDefault(
                                student.getStudentId(), null
                        );

                        return new ApplicantResponse(
                                app.getApplicationId(),
                                user.getName(),
                                user.getEmail(),
                                student.getRollNumber(),
                                student.getDepartment(),
                                student.getCgpa(),
                                student.getResumeLink(),
                                app.getStatus().toString(),
                                matchScore // NEW
                        );
                    }).toList();

            return new JobApplicantsResponse(
                    job.getJobId(),
                    job.getTitle(),
                    job.getCompany(),
                    applicants
            );

        }).toList();
    }

    // 🔹 On campus applications — UNCHANGED
    public List<Map<String, Object>> getOnCampusApplications(String email) {

        List<Application> applications =
                applicationRepository.findByStudent_User_Email(email);

        return applications.stream().map(app -> {

            Map<String, Object> response = new HashMap<>();
            response.put("applicationId", app.getApplicationId());
            response.put("jobId", app.getJob().getJobId());
            response.put("title", app.getJob().getTitle());
            response.put("company", app.getJob().getCompany());
            response.put("status", app.getStatus());
            response.put("appliedAt", app.getAppliedAt());

            return response;

        }).toList();
    }

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    // 🔹 Update application status — UNCHANGED
    public void updateApplicationStatus(
            Integer applicationId,
            ApplicationStatus status
    ) {

        Application application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status);
        applicationRepository.save(application);

        eventPublisher.publishEvent(
                new ApplicationStatusChangedEvent(
                        application.getApplicationId(),
                        application.getStudent().getUser().getUserId(),
                        status
                )
        );
    }
}