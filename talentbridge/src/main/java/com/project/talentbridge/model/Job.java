package com.project.talentbridge.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Integer jobId;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 100)
    private String company;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "eligibility_criteria", columnDefinition = "TEXT")
    private String eligibilityCriteria;

    @Column(name="jd_link")
    private String jdLink;

    @Column(name = "last_date")
    private LocalDate lastDate;

    @ManyToMany
    @JoinTable(
            name = "job_recruiters",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "recruiter_id")
    )
    private List<Recruiter> recruiters;

    @ManyToOne
    @JoinColumn(name = "approved_by", nullable = false)
    private Users approvedBy;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
