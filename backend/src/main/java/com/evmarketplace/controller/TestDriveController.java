package com.evmarketplace.controller;

import com.evmarketplace.dto.TestDriveBookingRequest;
import com.evmarketplace.model.TestDriveBooking;
import com.evmarketplace.service.TestDriveService;
import org.springframework.dao.DataAccessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test-drives")
@CrossOrigin(origins = "*")
public class TestDriveController {

    @Autowired
    private TestDriveService testDriveService;

    // GET /api/test-drives/slots/{vehicleId}
    // Returns list of available LocalDateTime slots for the given vehicle
    @GetMapping("/slots/{vehicleId}")
    public ResponseEntity<List<LocalDateTime>> getAvailableSlots(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(testDriveService.getAvailableSlots(vehicleId));
    }

    // POST /api/test-drives/book
    // Body: { "userId": 1, "vehicleId": 1, "bookingDateTime": "2026-07-14T09:00:00" }
    // Returns 201 Created on success, 409 Conflict if slot is already taken
    @PostMapping("/book")
    public ResponseEntity<Object> bookTestDrive(@RequestBody TestDriveBookingRequest request) {
        try {
            TestDriveBooking booking = testDriveService.bookTestDrive(
                    request.getUserId(),
                    request.getVehicleId(),
                    request.getBookingDateTime());
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Time slot was booked by another request. Please choose another slot."));
        }
    }

    // DELETE /api/test-drives/cancel/{bookingId}
    // Returns 200 OK with updated booking, 404 Not Found if bookingId does not exist
    @DeleteMapping("/cancel/{bookingId}")
    public ResponseEntity<Object> cancelBooking(@PathVariable Long bookingId) {
        try {
            TestDriveBooking booking = testDriveService.cancelBooking(bookingId);
            return ResponseEntity.ok(booking);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/test-drives/user/{userId}
    // Returns all bookings (confirmed and cancelled) for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TestDriveBooking>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(testDriveService.getUserBookings(userId));
    }
}
