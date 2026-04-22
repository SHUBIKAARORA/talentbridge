package com.project.talentbridge.service;

import com.project.talentbridge.model.ApplicationStatus;
import com.project.talentbridge.model.OffCampusApplication;
import com.project.talentbridge.model.Student;
import com.project.talentbridge.repository.OffCampusRepository;
import com.project.talentbridge.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OffCampusService {
    @Autowired
    private OffCampusRepository offCampusRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<OffCampusApplication> getApplications(String email) {

        return offCampusRepository.findByStudent_User_Email(email);
    }


    public OffCampusApplication createApplication(String email,
                                                  OffCampusApplication app) {

        Student student = studentRepository
                .findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        app.setStudent(student);

        return offCampusRepository.save(app);
    }


    public void updateStatus(Integer id, ApplicationStatus status) {

        OffCampusApplication app = offCampusRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        app.setStatus(status);

        offCampusRepository.save(app);
    }
}
