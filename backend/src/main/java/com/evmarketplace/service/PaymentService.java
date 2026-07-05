package com.evmarketplace.service;

import com.evmarketplace.model.Payment;
import com.evmarketplace.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    // Fake rule: approve two consecutive attempts, deny every 3rd, then repeat.
    public boolean processPayment(Long userId, Long orderId) {
        long attemptCount = paymentRepository.countByUserId(userId);
        boolean approved = (attemptCount % 3) != 2; // attempts 0,1 -> approved; attempt 2 -> denied
        paymentRepository.save(new Payment(userId, orderId, approved));

        return approved;
    }
}