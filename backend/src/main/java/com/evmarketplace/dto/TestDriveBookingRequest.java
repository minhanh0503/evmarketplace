package com.evmarketplace.dto;

import java.time.LocalDateTime;

// Request body for POST /api/test-drives/book
// Jackson deserializes LocalDateTime from ISO-8601 format: "2026-07-14T09:00:00"
// Add spring.jackson.serialization.write-dates-as-timestamps=false to application.properties
public class TestDriveBookingRequest {

    private Long userId;
    private Long vehicleId;
    private LocalDateTime bookingDateTime;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public LocalDateTime getBookingDateTime() { return bookingDateTime; }
    public void setBookingDateTime(LocalDateTime bookingDateTime) { this.bookingDateTime = bookingDateTime; }
}
