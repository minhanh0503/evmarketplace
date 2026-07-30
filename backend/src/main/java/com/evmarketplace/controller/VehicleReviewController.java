package com.evmarketplace.controller;

import com.evmarketplace.model.VehicleReview;
import com.evmarketplace.service.VehicleReviewService;
import com.evmarketplace.dto.VehicleReviewRequest;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle-reviews")
@CrossOrigin(origins = "*")
public class VehicleReviewController {


    @Autowired
    private VehicleReviewService vehicleReviewService;



    // GET all reviews
    @GetMapping
    public List<VehicleReview> getAllVehicleReviews() {

        return vehicleReviewService.getAllVehicleReviews();
    }



    // CREATE review
    @PostMapping
    public VehicleReview createVehicleReview(
            @Valid @RequestBody VehicleReviewRequest request
    ) {

        return vehicleReviewService.createVehicleReview(request);
    }



    // GET review by ID
    @GetMapping("/{id}")
    public VehicleReview getVehicleReview(
            @PathVariable Long id
    ) {

        return vehicleReviewService.getVehicleReviewById(id);
    }



    // GET reviews for a specific vehicle
    @GetMapping("/vehicle/{vehicleId}")
    public List<VehicleReview> getReviewsByVehicleId(
            @PathVariable Long vehicleId
    ) {

        return vehicleReviewService.getReviewsByVehicleId(vehicleId);
    }



    // GET average rating
    @GetMapping("/vehicle/{vehicleId}/rating")
    public double getAverageRating(
            @PathVariable Long vehicleId
    ) {

        return vehicleReviewService.getAverageRatingByVehicleId(vehicleId);
    }



    // DELETE review
    @DeleteMapping("/{id}")
    public void deleteVehicleReview(
            @PathVariable Long id
    ) {

        vehicleReviewService.deleteVehicleReview(id);
    }

}