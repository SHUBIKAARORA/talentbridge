package com.project.talentbridge.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;


import java.math.BigDecimal;

@Entity
@Table(name="students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Integer studentId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private Users user;

    @Column(name = "roll_number", length = 20)
    private String rollNumber;

    @Column(length = 50)
    private String department;

    private Integer year;

    @Column(precision = 3, scale = 2)
    private BigDecimal cgpa;

    @Column(name = "resume_link", columnDefinition = "TEXT")
    private String resumeLink;

    @Column(name = "resume_text", columnDefinition = "LONGTEXT")
    private String resumeText;

}

