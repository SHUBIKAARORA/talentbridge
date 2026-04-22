package com.project.talentbridge.controller;

import com.project.talentbridge.dto.request.ApplyRequest;
import com.project.talentbridge.dto.request.StatusUpdateRequest;
import com.project.talentbridge.dto.request.UpdateStudentProfileRequest;
import com.project.talentbridge.dto.response.JobResponse;
import com.project.talentbridge.dto.response.StudentProfileResponse;
import com.project.talentbridge.model.Application;
import com.project.talentbridge.model.OffCampusApplication;
import com.project.talentbridge.service.ApplicationService;
import com.project.talentbridge.service.JobService;
import com.project.talentbridge.service.OffCampusService;
import com.project.talentbridge.service.StudentService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.Loader;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/profile")
    public ResponseEntity<StudentProfileResponse> getProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        StudentProfileResponse profile =
                studentService.getMyProfile(email);

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateStudentProfileRequest request
    ) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        studentService.updateMyProfile(email, request);

        return ResponseEntity.ok("Profile updated successfully");
    }

    // NEW ENDPOINT — handles PDF upload, text extraction, DB save
    @PostMapping("/resume")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        try {
            String email = authentication.getName();

            // 1. Validate PDF
            if (file.isEmpty() || !file.getContentType().equals("application/pdf")) {
                return ResponseEntity.badRequest().body("Only PDF files are allowed");
            }

            // 2. Create uploads/resumes directory if it doesn't exist
            String uploadDir = "uploads/resumes/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 3. Save PDF with email-based filename to avoid conflicts
            String filename = email.replace("@", "_").replace(".", "_") + "_resume.pdf";
            Path filePath = uploadPath.resolve(filename);
            Files.write(filePath, file.getBytes());

            // 4. Extract text using PDFBox
            PDFTextStripper stripper = new PDFTextStripper();
            String resumeText;
            try (PDDocument document = Loader.loadPDF(filePath.toFile())) {
                resumeText = stripper.getText(document);
            }

            // 5. Save path + extracted text to DB
            studentService.updateResumeInfo(email, filePath.toString(), resumeText);

            return ResponseEntity.ok("Resume uploaded successfully");

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to upload resume: " + e.getMessage());
        }
    }

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/applications")
    public ResponseEntity<?> apply(
            @RequestBody ApplyRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        applicationService.applyToJob(email, request.getJobId());

        return ResponseEntity.ok("Application submitted");
    }

    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getApplications(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                applicationService.getStudentApplications(email)
        );
    }

    @GetMapping("/oncampus")
    public ResponseEntity<?> getOnCampusApplications(Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                applicationService.getOnCampusApplications(email)
        );
    }

    @Autowired
    private OffCampusService offCampusService;

    @GetMapping("/offcampus")
    public ResponseEntity<?> getOffCampusApplications(Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                offCampusService.getApplications(email)
        );
    }

    @PostMapping("/offcampus")
    public ResponseEntity<?> addApplication(
            @RequestBody OffCampusApplication app,
            Authentication authentication
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                offCampusService.createApplication(email, app)
        );
    }

    @PutMapping("/offcampus/{id}")
    public ResponseEntity<?> updateStatus(
            @PathVariable Integer id,
            @RequestBody StatusUpdateRequest request
    ) {

        offCampusService.updateStatus(id, request.getStatus());

        return ResponseEntity.ok("Status updated");
    }
}