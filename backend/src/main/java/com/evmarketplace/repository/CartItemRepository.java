package com.evmarketplace.repository;

import com.evmarketplace.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUser_Id(Long userId);

    Optional<CartItem> findByUser_IdAndVehicle_Id(Long userId, Long vehicleId);

    void deleteByUser_Id(Long userId);
}