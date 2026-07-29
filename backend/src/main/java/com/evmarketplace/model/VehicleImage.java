package com.evmarketplace.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "vehicle_images")
public class VehicleImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String imageUrl;


    @Column(nullable = false)
    private int displayOrder;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    @JsonIgnore
    private Vehicle vehicle;


    public VehicleImage() {
    }


    public VehicleImage(String imageUrl, int displayOrder, Vehicle vehicle) {
        this.imageUrl = imageUrl;
        this.displayOrder = displayOrder;
        this.vehicle = vehicle;
    }


    public Long getId() {
        return id;
    }


    public String getImageUrl() {
        return imageUrl;
    }


    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }


    public int getDisplayOrder() {
        return displayOrder;
    }


    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }


    public Vehicle getVehicle() {
        return vehicle;
    }


    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }
}
