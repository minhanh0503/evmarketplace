package com.evmarketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.evmarketplace.model.CartItem;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}