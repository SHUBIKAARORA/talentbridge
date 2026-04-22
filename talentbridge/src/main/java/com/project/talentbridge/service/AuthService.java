package com.project.talentbridge.service;

import com.project.talentbridge.dto.request.LoginRequest;
import com.project.talentbridge.dto.request.RegisterRequest;
import com.project.talentbridge.dto.response.LoginResponse;
import com.project.talentbridge.model.*;
import com.project.talentbridge.repository.AlumniRepository;
import com.project.talentbridge.repository.RecruiterRepository;
import com.project.talentbridge.repository.StudentRepository;
import com.project.talentbridge.repository.UserRepository;
import com.project.talentbridge.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AlumniRepository alumniRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    public Users register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Users user = new Users();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.valueOf(request.getRole()));

        Users savedUser = userRepository.save(user);

        switch (request.getRole().toLowerCase()) {
            case "student" -> {
                Student student = studentRepository
                        .findByUser_UserId(savedUser.getUserId())
                        .orElse(new Student());
                student.setUser(savedUser);
                student.setRollNumber(request.getRollNumber());
                student.setDepartment(request.getDepartment());
                student.setYear(request.getYear());
                student.setCgpa(request.getCgpa());
                student.setResumeLink(request.getResumeLink());
                studentRepository.save(student);
            }
            case "alumni" -> {
                Alumni alumni = alumniRepository
                        .findByUser_UserId(savedUser.getUserId())
                        .orElse(new Alumni());
                alumni.setUser(savedUser);
                alumni.setCompany(request.getCompany());
                alumni.setDesignation(request.getDesignation());
                alumni.setExperienceYears(request.getExperienceYears());
                alumniRepository.save(alumni);
            }
            case "recruiter" -> {
                Recruiter recruiter = recruiterRepository
                        .findByUser_UserId(savedUser.getUserId())
                        .orElse(new Recruiter());

//                Recruiter recruiter = new Recruiter();
                recruiter.setUser(savedUser);
                recruiter.setCompany(request.getCompany());
                recruiter.setDesignation(request.getDesignation());
                recruiterRepository.save(recruiter);
            }
            // admin/T&P — no extra table, do nothing
        }

        return savedUser;
    }

    public LoginResponse login(LoginRequest request){

        Users user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token=jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );
        return new LoginResponse(token,user.getRole().name(),user.getUserId() );
    }
}
