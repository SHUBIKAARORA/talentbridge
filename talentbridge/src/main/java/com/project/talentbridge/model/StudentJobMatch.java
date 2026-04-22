package com.project.talentbridge.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_job_match")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentJobMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "job_id", nullable = false)
    private Integer jobId;

    @Column(name = "match_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal matchScore;

    @Column(name = "embedding_score", precision = 5, scale = 2)
    private BigDecimal embeddingScore;

    @Column(name = "cgpa_score", precision = 5, scale = 2)
    private BigDecimal cgpaScore;

    @Column(name = "branch_score", precision = 5, scale = 2)
    private BigDecimal branchScore;

    @Column(name = "computed_at")
    private LocalDateTime computedAt;
}
