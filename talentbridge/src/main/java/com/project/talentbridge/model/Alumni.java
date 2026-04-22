package com.project.talentbridge.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="alumni")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alumni {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alumni_id")
    private Integer alumniId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private Users user;

    @Column(length = 100)
    private String company;

    @Column(length = 100)
    private String designation;

    @Column(name = "experience_years")
    private Integer experienceYears;
}
