package com.evmarketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.evmarketplace.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    long countByUserId(Long userId);
}