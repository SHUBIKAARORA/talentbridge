package com.project.talentbridge.service;

import com.project.talentbridge.model.Job;
import com.project.talentbridge.model.Student;
import com.project.talentbridge.model.StudentJobMatch;
import com.project.talentbridge.repository.JobRepository;
import com.project.talentbridge.repository.StudentJobMatchRepository;
import com.project.talentbridge.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class MatchingService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private StudentJobMatchRepository matchRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String FLASK_URL = "http://localhost:5000/similarity";

    // Main method — called when a job is posted
    public void computeMatchesForJob(Integer jobId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        List<Student> allStudents = studentRepository.findAll();

        // Combine description + eligibility for richer embedding
        String jobText = buildJobText(job);

        for (Student student : allStudents) {

            try {
                // Skip students with no resume text yet
                if (student.getResumeText() == null || student.getResumeText().isBlank()) {
                    continue;
                }

                // 1. Embedding score from Flask (60%)
                double embeddingScore = getEmbeddingScore(student.getResumeText(), jobText);

                // 2. CGPA score (25%)
                double cgpaScore = computeCgpaScore(student.getCgpa(), job.getEligibilityCriteria());

                // 3. Branch score (15%)
                double branchScore = computeBranchScore(student.getDepartment(), job.getEligibilityCriteria());

                // 4. Final weighted score
                double finalScore = (embeddingScore * 0.60)
                        + (cgpaScore * 0.25)
                        + (branchScore * 0.15);

                finalScore = Math.min(finalScore, 100.0); // cap at 100

                // 5. Save to DB (update if already exists)
                saveOrUpdateMatch(
                        student.getStudentId(),
                        jobId,
                        finalScore,
                        embeddingScore,
                        cgpaScore,
                        branchScore
                );

            } catch (Exception e) {
                // Don't let one student failure stop the whole batch
                System.err.println("Matching failed for student "
                        + student.getStudentId() + ": " + e.getMessage());
            }
        }
    }

    // Combines description + eligibility into one rich text for embedding
    private String buildJobText(Job job) {
        StringBuilder sb = new StringBuilder();
        if (job.getDescription() != null) sb.append(job.getDescription()).append(" ");
        if (job.getEligibilityCriteria() != null) sb.append(job.getEligibilityCriteria());
        return sb.toString().trim();
    }

    // Calls Flask microservice and returns embedding similarity score (0-100)
    private double getEmbeddingScore(String resumeText, String jobText) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = new HashMap<>();
            body.put("resumeText", resumeText);
            body.put("jobText", jobText);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    FLASK_URL, entity, Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Object score = response.getBody().get("score");
                return Double.parseDouble(score.toString());
            }
        } catch (Exception e) {
            System.err.println("Flask call failed: " + e.getMessage());
        }
        return 0.0; // default if Flask is unreachable
    }

    // Parses CGPA from eligibility text and scores student (0-100)
    // Handles: "CGPA > 7", "Minimum CGPA: 7.5", "CGPA >= 7.5", "65%"
    private double computeCgpaScore(BigDecimal studentCgpa, String eligibility) {
        if (studentCgpa == null || eligibility == null) return 50.0; // neutral if unknown

        double requiredCgpa = extractCgpaFromText(eligibility);

        if (requiredCgpa == 0.0) return 50.0; // no CGPA requirement found → neutral

        // If eligibility uses percentage (e.g. 65%), convert to 10-point scale
        if (requiredCgpa > 10) requiredCgpa = requiredCgpa / 10.0;

        double studentCgpaDouble = studentCgpa.doubleValue();

        if (studentCgpaDouble >= requiredCgpa) {
            // Bonus for exceeding requirement
            double excess = studentCgpaDouble - requiredCgpa;
            return Math.min(100.0, 80.0 + (excess * 10));
        } else {
            // Partial score for being close
            double ratio = studentCgpaDouble / requiredCgpa;
            return Math.max(0.0, ratio * 60.0);
        }
    }

    // Extracts numeric CGPA value from free text using regex
    private double extractCgpaFromText(String text) {
        // Matches patterns like: CGPA > 7, CGPA: 7.5, CGPA >= 7.5, Minimum CGPA 7, 65%
        Pattern pattern = Pattern.compile(
                "(?:cgpa|gpa)[\\s:=>]*(\\d+\\.?\\d*)|minimum[\\s]+(\\d+\\.?\\d*)|\\b(\\d+)%",
                Pattern.CASE_INSENSITIVE
        );
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            for (int i = 1; i <= matcher.groupCount(); i++) {
                if (matcher.group(i) != null) {
                    return Double.parseDouble(matcher.group(i));
                }
            }
        }
        return 0.0;
    }

    // Checks if student department matches branches in eligibility (0 or 100)
    private double computeBranchScore(String department, String eligibility) {
        if (department == null || eligibility == null) return 50.0;

        String deptLower = department.toLowerCase().trim();
        String eligLower = eligibility.toLowerCase();

        // Common branch keywords to look for
        String[] branchKeywords = {
                "cse", "cs", "computer science",
                "it", "information technology",
                "ece", "electronics",
                "eee", "electrical",
                "mechanical", "mech",
                "civil", "chemical",
                "related fields", "any branch", "all branches"
        };

        // Check if eligibility says "any branch" or "all branches"
        if (eligLower.contains("any branch") || eligLower.contains("all branches")
                || eligLower.contains("related fields")) {
            return 100.0;
        }

        // Check if student's department appears in eligibility text
        for (String keyword : branchKeywords) {
            if (deptLower.contains(keyword) && eligLower.contains(keyword)) {
                return 100.0;
            }
        }

        return 0.0; // branch not mentioned = not eligible
    }

    // Saves new match or updates existing one
    private void saveOrUpdateMatch(Integer studentId, Integer jobId,
                                   double finalScore, double embeddingScore,
                                   double cgpaScore, double branchScore) {

        StudentJobMatch match = matchRepository
                .findByStudentIdAndJobId(studentId, jobId)
                .orElse(new StudentJobMatch());

        match.setStudentId(studentId);
        match.setJobId(jobId);
        match.setMatchScore(BigDecimal.valueOf(finalScore).setScale(2, RoundingMode.HALF_UP));
        match.setEmbeddingScore(BigDecimal.valueOf(embeddingScore).setScale(2, RoundingMode.HALF_UP));
        match.setCgpaScore(BigDecimal.valueOf(cgpaScore).setScale(2, RoundingMode.HALF_UP));
        match.setBranchScore(BigDecimal.valueOf(branchScore).setScale(2, RoundingMode.HALF_UP));
        match.setComputedAt(LocalDateTime.now());

        matchRepository.save(match);
    }
}