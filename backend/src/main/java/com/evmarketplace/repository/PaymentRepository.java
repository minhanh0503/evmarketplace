package com.evmarketplace.repository;

import com.evmarketplace.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    long countByUserId(Long userId);
}