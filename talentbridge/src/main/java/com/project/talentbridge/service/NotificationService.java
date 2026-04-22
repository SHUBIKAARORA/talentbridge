package com.project.talentbridge.service;
import com.project.talentbridge.model.Notification;
import com.project.talentbridge.model.Users;
import com.project.talentbridge.repository.NotificationRepository;
import com.project.talentbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;


    public void createNotification(Integer userId, String type, String message,
                                       Integer relatedId, String redirectUrl) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));


        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setMessage(message);
        notification.setRelatedId(relatedId);
        notification.setRedirectUrl(redirectUrl);
        notification.setIsRead(false);

        notificationRepository.save(notification);
    }
}

