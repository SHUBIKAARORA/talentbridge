package com.project.talentbridge.service;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class FirebaseService {

    public void sendNotification(Integer userId, String message, String type, Integer refId) {

        DatabaseReference ref = FirebaseDatabase
                .getInstance()
                .getReference("notifications")
                .child(String.valueOf(userId));

        Map<String, Object> data = new HashMap<>();
        data.put("message", message);
        data.put("type", type);
        data.put("refId", refId);
        data.put("timestamp", System.currentTimeMillis());

        ref.push().setValueAsync(data);
    }
}