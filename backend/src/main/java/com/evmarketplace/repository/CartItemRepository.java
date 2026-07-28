package com.evmarketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.evmarketplace.model.CartItem;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    @Query("SELECT c FROM CartItem c WHERE c.user.id = :userId")
    List<CartItem> findByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}