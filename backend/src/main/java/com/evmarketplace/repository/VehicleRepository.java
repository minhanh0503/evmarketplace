package com.evmarketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.evmarketplace.model.Vehicle;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByDiscountGreaterThanOrderByDiscountDesc(BigDecimal discount);
}
