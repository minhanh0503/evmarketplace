package com.evmarketplace.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.evmarketplace.model.Vehicle;
import com.evmarketplace.model.VehicleReview;
import com.evmarketplace.dto.VehicleReviewRequest;
import com.evmarketplace.repository.VehicleReviewRepository;
import com.evmarketplace.repository.VehicleRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VehicleReviewService {

    @Autowired
    private VehicleReviewRepository vehicleReviewRepository;

    @Autowired
    private VehicleRepository vehicleRepository;


    public List<VehicleReview> getAllVehicleReviews() {
        return vehicleReviewRepository.findAll();
    }


    public VehicleReview getVehicleReviewById(Long id) {

        return vehicleReviewRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException(
                        "Vehicle review not found with id: " + id
                    )
                );
    }


    public VehicleReview createVehicleReview(VehicleReviewRequest request) {

        Vehicle vehicle = vehicleRepository.findById(
            request.getVehicleId()
        )
        .orElseThrow(() ->
            new RuntimeException("Vehicle not found")
        );


        VehicleReview review = new VehicleReview();

        review.setVehicle(vehicle);
        review.setReviewerName(
            request.getReviewerName()
        );
        review.setRating(
            request.getRating()
        );
        review.setComment(
            request.getComment()
        );
        review.setReviewDate(
            LocalDateTime.now()
        );

        return vehicleReviewRepository.save(review);
    }


    public List<VehicleReview> getReviewsByVehicleId(Long vehicleId) {

        return vehicleReviewRepository.findByVehicleId(vehicleId);
    }


    public double getAverageRatingByVehicleId(Long vehicleId) {

        List<VehicleReview> reviews =
                getReviewsByVehicleId(vehicleId);


        if (reviews.isEmpty()) {
            return 0.0;
        }


        return reviews.stream()
                .mapToInt(VehicleReview::getRating)
                .average()
                .orElse(0.0);
    }


    public List<VehicleReview> getReviewsByRating(int rating) {

        return vehicleReviewRepository.findByRating(rating);
    }


    public void deleteVehicleReview(Long id) {

        vehicleReviewRepository.deleteById(id);
    }
}