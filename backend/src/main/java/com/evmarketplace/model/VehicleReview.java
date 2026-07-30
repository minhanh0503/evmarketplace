package com.evmarketplace.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_reviews")
public class VehicleReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    @JsonIgnore
    private Vehicle vehicle;


    @Column(name = "reviewer_name", nullable = false)
    private String reviewerName;


    @Column(nullable = false)
    private int rating;


    @Column(nullable = false, length = 1000)
    private String comment;


    @Column(name = "review_date", nullable = false)
    private LocalDateTime reviewDate;



    public VehicleReview() {
    }


    public VehicleReview(
            Vehicle vehicle,
            String reviewerName,
            int rating,
            String comment,
            LocalDateTime reviewDate
    ) {
        this.vehicle = vehicle;
        this.reviewerName = reviewerName;
        this.rating = rating;
        this.comment = comment;
        this.reviewDate = reviewDate;
    }


    public Long getId() {
        return id;
    }


    public Vehicle getVehicle() {
        return vehicle;
    }


    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
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


    public LocalDateTime getReviewDate() {
        return reviewDate;
    }


    public void setReviewDate(LocalDateTime reviewDate) {
        this.reviewDate = reviewDate;
    }
}