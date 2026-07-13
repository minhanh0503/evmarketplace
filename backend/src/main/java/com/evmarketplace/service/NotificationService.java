package com.evmarketplace.service;

import com.evmarketplace.model.Notification;
import com.evmarketplace.model.NotificationType;
import com.evmarketplace.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // Called by TestDriveService after a successful booking
    @Transactional
    public Notification sendBookingConfirmation(Long userId, Long bookingId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage("Your test drive booking (ID: " + bookingId + ") has been confirmed.");
        notification.setType(NotificationType.BOOKING_CONFIRMATION);
        notification.setSentAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    // Called by OrderService (Tazwar) after a successful order — Tazwar autowires this service
    @Transactional
    public Notification sendOrderConfirmation(Long userId, Long orderId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage("Your order (ID: " + orderId + ") has been placed successfully.");
        notification.setType(NotificationType.ORDER_CONFIRMATION);
        notification.setSentAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserId(userId);
    }
}
