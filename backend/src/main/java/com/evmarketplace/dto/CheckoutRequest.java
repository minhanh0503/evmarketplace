package com.evmarketplace.dto;

public class CheckoutRequest {
    private Long userId;

    public CheckoutRequest() {
        // default constructor required by Jackson
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}