package com.project.talentbridge.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name="alumni_experiences")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlumniExperience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "experience_id")
    private Integer experienceId;

    @ManyToOne
    @JoinColumn(name = "alumni_id", nullable = false)
    private Alumni alumni;

    @Column(nullable = false, length = 100)
    private String company;

    @Column(length = 100)
    private String role;

    @Column(name = "rounds_count")
    private Integer roundsCount;

    @Column(name = "experience_description", columnDefinition = "TEXT", nullable = false)
    private String experienceDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "overall_experience")
    private OverallExperience overallExperience;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
