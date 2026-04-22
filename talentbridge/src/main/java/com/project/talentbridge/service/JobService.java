package com.project.talentbridge.service;

import com.project.talentbridge.dto.request.AddJobRequest;
import com.project.talentbridge.dto.response.JobResponse;
import com.project.talentbridge.events.JobCreatedEvent;
import com.project.talentbridge.model.Job;
import com.project.talentbridge.model.Recruiter;
import com.project.talentbridge.model.StudentJobMatch;
import com.project.talentbridge.model.Users;
import com.project.talentbridge.repository.JobRepository;
import com.project.talentbridge.repository.StudentJobMatchRepository;
import com.project.talentbridge.repository.StudentRepository;
import com.project.talentbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.project.talentbridge.repository.RecruiterRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StudentJobMatchRepository matchRepository;

    public void addJob(String email, AddJobRequest request) {

        Users admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Recruiter> recruiters = recruiterRepository
                .findAllById(request.getRecruiterIds());

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setCompany(request.getCompany());
        job.setDescription(request.getDescription());
        job.setEligibilityCriteria(request.getEligibilityCriteria());
        job.setJdLink(request.getJdLink());
        job.setLastDate(request.getLastDate());
        job.setApprovedBy(admin);
        job.setRecruiters(recruiters);

        jobRepository.save(job);

        List<Integer> recruiterUserIds = recruiters.stream()
                .map(r -> r.getUser().getUserId())
                .toList();

        eventPublisher.publishEvent(
                new JobCreatedEvent(job.getJobId(), recruiterUserIds)
        );
    }

    public List<JobResponse> getAllJobs() {

        List<Job> jobs = jobRepository.findAll();

        return jobs.stream().map(job -> new JobResponse(
                job.getJobId(),
                job.getTitle(),
                job.getCompany(),
                job.getDescription(),
                job.getEligibilityCriteria(),
                job.getJdLink(),
                job.getLastDate(),
                job.getCreatedAt(),
                null // no match score in admin view
        )).collect(Collectors.toList());
    }

    // NEW — for student dashboard, includes match score per job
    public List<JobResponse> getJobsForStudent(String email) {

        // Get student id from email
        var student = studentRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Integer studentId = student.getStudentId();

        // Get all match scores for this student in one DB call
        List<StudentJobMatch> matches = matchRepository.findByStudentId(studentId);

        // Build a map of jobId -> matchScore for quick lookup
        Map<Integer, java.math.BigDecimal> scoreMap = matches.stream()
                .collect(Collectors.toMap(
                        StudentJobMatch::getJobId,
                        StudentJobMatch::getMatchScore
                ));

        // Get all jobs and attach match score
        List<Job> jobs = jobRepository.findAll();

        return jobs.stream().map(job -> new JobResponse(
                job.getJobId(),
                job.getTitle(),
                job.getCompany(),
                job.getDescription(),
                job.getEligibilityCriteria(),
                job.getJdLink(),
                job.getLastDate(),
                job.getCreatedAt(),
                scoreMap.getOrDefault(job.getJobId(), null) // null if not computed yet
        )).collect(Collectors.toList());
    }

    public List<JobResponse> getJobsForRecruiter(String email) {

        List<Job> jobs = jobRepository.findByRecruiters_User_Email(email);

        return mapJobsToResponse(jobs);
    }

    private List<JobResponse> mapJobsToResponse(List<Job> jobs) {

        return jobs.stream().map(job -> new JobResponse(
                job.getJobId(),
                job.getTitle(),
                job.getCompany(),
                job.getDescription(),
                job.getEligibilityCriteria(),
                job.getJdLink(),
                job.getLastDate(),
                job.getCreatedAt(),
                null
        )).toList();
    }
}