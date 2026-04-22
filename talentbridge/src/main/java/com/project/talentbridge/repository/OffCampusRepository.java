package com.project.talentbridge.repository;

import com.project.talentbridge.model.OffCampusApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OffCampusRepository extends JpaRepository<OffCampusApplication, Integer>  {
    List<OffCampusApplication> findByStudent_User_Email(String email);
}
