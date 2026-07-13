package com.evmarketplace.dto;

// One row in the usage report: count of a given event type (VIEW, CART, PURCHASE)
public class UsageReportEntry {

    private String eventType;
    private long count;

    public UsageReportEntry(String eventType, long count) {
        this.eventType = eventType;
        this.count = count;
    }

    public String getEventType() { return eventType; }
    public long getCount() { return count; }
}
