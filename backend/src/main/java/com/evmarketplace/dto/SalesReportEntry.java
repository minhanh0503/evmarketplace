package com.evmarketplace.dto;

// One row in the sales report: how many CONFIRMED orders in a given month/year
public class SalesReportEntry {

    private int year;
    private int month;
    private long orderCount;

    public SalesReportEntry(int year, int month, long orderCount) {
        this.year = year;
        this.month = month;
        this.orderCount = orderCount;
    }

    public int getYear() { return year; }
    public int getMonth() { return month; }
    public long getOrderCount() { return orderCount; }
}
