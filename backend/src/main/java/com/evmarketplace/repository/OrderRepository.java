package com.evmarketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.evmarketplace.model.Order;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    List<Order> findByStatus(Order.Status status);
}
