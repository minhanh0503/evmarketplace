package com.evmarketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.evmarketplace.model.VehicleReview;
import java.util.List;

@Repository
public interface VehicleReviewRepository extends JpaRepository<VehicleReview, Long> {
    List<VehicleReview> findByVehicleId(Long vehicleId);

    List<VehicleReview> findByRating(int rating);
}
