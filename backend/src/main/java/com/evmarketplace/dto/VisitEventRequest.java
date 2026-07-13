package com.evmarketplace.dto;

// Request body for POST /api/admin/events
// Used to manually seed visit events for testing the usage report
public class VisitEventRequest {

    private String ipAddress;
    private Long vehicleId;
    private String eventType; // VIEW, CART, or PURCHASE

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
}
