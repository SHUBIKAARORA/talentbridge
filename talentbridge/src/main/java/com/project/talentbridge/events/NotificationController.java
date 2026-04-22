package com.project.talentbridge.events;

import com.project.talentbridge.model.Notification;
import com.project.talentbridge.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin
public class NotificationController {
    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/{userId}")
    public List<Notification> getNotifications(@PathVariable Integer userId) {
        return notificationRepository
                .findByUser_UserIdOrderByCreatedAtDesc(userId);
    }


    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Integer id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
}
