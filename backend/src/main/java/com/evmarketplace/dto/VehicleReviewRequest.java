package com.evmarketplace.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VehicleReviewRequest {

    @NotNull
    private Long vehicleId;

    @NotBlank
    private String reviewerName;

    @Min(1)
    @Max(5)
    private int rating;

    @NotBlank
    private String comment;

    public VehicleReviewRequest() {
    }

    public VehicleReviewRequest(Long vehicleId, String reviewerName, int rating, String comment) {
        this.vehicleId = vehicleId;
        this.reviewerName = reviewerName;
        this.rating = rating;
        this.comment = comment;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getReviewerName() {
        return reviewerName;
    }

    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}