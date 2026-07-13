package com.evmarketplace.repository;

import com.evmarketplace.model.BookingStatus;
import com.evmarketplace.model.TestDriveBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TestDriveBookingRepository extends JpaRepository<TestDriveBooking, Long> {

    // All bookings for a user (for GET /api/test-drives/user/{userId})
    List<TestDriveBooking> findByUserId(Long userId);

    // All bookings for a vehicle (used by getAvailableSlots to find taken slots)
    List<TestDriveBooking> findByVehicleId(Long vehicleId);

    // Conflict check: returns true if a CONFIRMED booking already exists for this vehicle + time
    boolean existsByVehicleIdAndBookingDateTimeAndStatus(
            Long vehicleId, LocalDateTime bookingDateTime, BookingStatus status);
}
