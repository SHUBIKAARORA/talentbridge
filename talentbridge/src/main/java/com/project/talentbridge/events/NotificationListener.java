package com.project.talentbridge.events;

import com.project.talentbridge.model.Users;
import com.project.talentbridge.repository.StudentRepository;
import com.project.talentbridge.repository.UserRepository;
import com.project.talentbridge.service.EmailService;
import com.project.talentbridge.service.FirebaseService;
import com.project.talentbridge.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class NotificationListener {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FirebaseService firebaseService;

    @EventListener
    public void handleJobCreated(JobCreatedEvent event) {

        // TODO: get all eligible students
        List<Integer> studentIds = getEligibleStudents(event.getJobId());

        for (Integer studentId : studentIds) {
            notificationService.createNotification(
                    studentId,
                    "JOB_POSTED",
                    "A new job has been posted!",
                    event.getJobId(),
                    "/jobs/" + event.getJobId()
            );

            firebaseService.sendNotification(
                    studentId,
                    "A new job has been posted!",
                    "JOB_POSTED",
                    event.getJobId()
            );

            Users user = userRepository.findById(studentId).orElseThrow();

            emailService.sendEmail(
                    user.getEmail(),
                    "New Job Posted 🚀",
                    "A new job has been posted. Check it now!"
            );
        }

        for (Integer recruiterId : event.getRecruiterIds()) {

    notificationService.createNotification(
        recruiterId,
        "JOB_POSTED",
        "A job you are assigned to has been posted!",
        event.getJobId(),
        "/jobs/" + event.getJobId()
    );

    firebaseService.sendNotification(
            recruiterId,
            "A job you are assigned to has been posted!",
            "JOB_POSTED",
            event.getJobId()
    );

    Users recruiter = userRepository.findById(recruiterId).orElseThrow();

    emailService.sendEmail(
        recruiter.getEmail(),
        "A New Job Posted ",
        "You've been added to a new job . Check it out now !"
    );
}


    }

    @EventListener
    public void handleStatusChange(ApplicationStatusChangedEvent event) {

        notificationService.createNotification(
                event.getStudentId(),
                "STATUS_UPDATED",
                "Your application status changed to " + event.getStatus(),
                event.getApplicationId(),
                "/applications/" + event.getApplicationId()
        );

        firebaseService.sendNotification(
                event.getStudentId(),
                "Your application status changed to " + event.getStatus(),
                "STATUS_UPDATED",
                event.getApplicationId()
        );

        Users user = userRepository.findById(event.getStudentId()).orElseThrow();

        emailService.sendEmail(
                user.getEmail(),
                "Application Status Update",
                "Your application status is now: " + event.getStatus()+"for the application:"+event.getApplicationId()
        );
    }

    private List<Integer> getEligibleStudents(Integer jobId) {
        return studentRepository.findAll()
                .stream()
                .map(student -> student.getUser().getUserId()) // adjust if needed
                .toList();
    }

}
