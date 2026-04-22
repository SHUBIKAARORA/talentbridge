package com.project.talentbridge.service;

import com.project.talentbridge.dto.request.UpdateStudentProfileRequest;
import com.project.talentbridge.dto.response.StudentProfileResponse;
import com.project.talentbridge.model.Student;
import com.project.talentbridge.model.Users;
import com.project.talentbridge.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public StudentProfileResponse getMyProfile(String email) {

        Student student = studentRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        Users user = student.getUser();

        return new StudentProfileResponse(
                student.getStudentId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                student.getRollNumber(),
                student.getDepartment(),
                student.getYear(),
                student.getCgpa(),
                student.getResumeLink()
        );
    }

    public void updateMyProfile(
            String email,
            UpdateStudentProfileRequest request
    ) {

        Student student = studentRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        student.setRollNumber(request.getRollNumber());
        student.setDepartment(request.getDepartment());
        student.setYear(request.getYear());
        student.setCgpa(request.getCgpa());
        student.setResumeLink(request.getResumeLink());

        studentRepository.save(student);
    }

    // NEW METHOD — called after PDF upload and text extraction
    public void updateResumeInfo(String email, String resumeLink, String resumeText) {

        Student student = studentRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        student.setResumeLink(resumeLink);
        student.setResumeText(resumeText);

        studentRepository.save(student);
    }
}