package com.evmarketplace.dto;

public class AddToCartRequest {
    private Long userId;
    private Long vehicleId;
    private Integer quantity;

    public AddToCartRequest() {
        // default constructor required by Jackson
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}