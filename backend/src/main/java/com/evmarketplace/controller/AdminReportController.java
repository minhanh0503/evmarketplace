package com.evmarketplace.controller;

import com.evmarketplace.dto.SalesReportEntry;
import com.evmarketplace.dto.UsageReportEntry;
import com.evmarketplace.dto.VisitEventRequest;
import com.evmarketplace.model.VisitEvent;
import com.evmarketplace.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminReportController {

    @Autowired
    private AnalyticsService analyticsService;

    // GET /api/admin/reports/sales
    // Returns CONFIRMED order counts grouped by year and month
    // Requires at least one CONFIRMED order in the orders table
    @GetMapping("/reports/sales")
    public ResponseEntity<List<SalesReportEntry>> getSalesReport() {
        return ResponseEntity.ok(analyticsService.generateSalesReport());
    }

    // GET /api/admin/reports/usage
    // Returns count of VIEW, CART, and PURCHASE events from visit_events table
    @GetMapping("/reports/usage")
    public ResponseEntity<List<UsageReportEntry>> getUsageReport() {
        return ResponseEntity.ok(analyticsService.generateUsageReport());
    }

    // POST /api/admin/events
    // Body: { "ipAddress": "1.2.3.4", "vehicleId": 1, "eventType": "VIEW" }
    // Manually seeds a visit event — used for testing the usage report endpoint
    @PostMapping("/events")
    public ResponseEntity<VisitEvent> recordVisitEvent(@RequestBody VisitEventRequest request) {
        VisitEvent event = analyticsService.recordVisitEvent(
                request.getIpAddress(),
                request.getVehicleId(),
                request.getEventType());
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }
}
