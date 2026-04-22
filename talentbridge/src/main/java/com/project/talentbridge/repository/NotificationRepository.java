package com.project.talentbridge.repository;

import com.project.talentbridge.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification,Integer> {
    List<Notification> findByUser_UserIdOrderByCreatedAtDesc(Integer userId);
}
