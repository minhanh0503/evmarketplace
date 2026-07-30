package com.evmarketplace.service;

import com.evmarketplace.model.BookingStatus;
import com.evmarketplace.model.TestDriveBooking;
import com.evmarketplace.repository.TestDriveBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestDriveService {

    @Autowired
    private TestDriveBookingRepository testDriveBookingRepository;

    @Autowired
    private NotificationService notificationService;

    // Returns available 1-hour slots for a given vehicle over the next 7 days (9am-5pm)
    @SuppressWarnings("null")
    public List<LocalDateTime> getAvailableSlots(Long vehicleId) {
        // Generate all candidate slots: tomorrow through 7 days out, 9am to 5pm, hourly
        LocalDateTime base = LocalDateTime.now()
                .plusDays(1)
                .withHour(9)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);

        List<LocalDateTime> allSlots = new ArrayList<>();
        for (int day = 0; day < 7; day++) {
            for (int hour = 0; hour < 9; hour++) { // 9am, 10am, ..., 5pm = 9 slots
                allSlots.add(base.plusDays(day).plusHours(hour));
            }
        }

        // Collect already-confirmed booking times for this vehicle
        List<LocalDateTime> bookedSlots = testDriveBookingRepository
                .findByVehicleId(vehicleId)
                .stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .map(TestDriveBooking::getBookingDateTime)
                .collect(Collectors.toList());

        allSlots.removeAll(bookedSlots);
        return allSlots;
    }

    // Books a test drive. Throws IllegalStateException if the slot is already taken.
    // @Transactional ensures the conflict check + save are atomic within one DB transaction.
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public TestDriveBooking bookTestDrive(Long userId, Long vehicleId, LocalDateTime bookingDateTime) {
        if (checkBookingConflict(vehicleId, bookingDateTime)) {
            throw new IllegalStateException(
                    "Time slot " + bookingDateTime + " is already booked for vehicle: " + vehicleId);
        }

        TestDriveBooking booking = new TestDriveBooking();
        booking.setUserId(userId);
        booking.setVehicleId(vehicleId);
        booking.setBookingDateTime(bookingDateTime);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setCreatedAt(LocalDateTime.now());

        TestDriveBooking saved = testDriveBookingRepository.save(booking);

        // Persist a confirmation notification (no email — just a DB record for D2)
        notificationService.sendBookingConfirmation(userId, saved.getId());

        return saved;
    }

    // Returns true if a CONFIRMED booking exists for this vehicle at this exact time
    public boolean checkBookingConflict(Long vehicleId, LocalDateTime bookingDateTime) {
        return testDriveBookingRepository.existsByVehicleIdAndBookingDateTimeAndStatus(
                vehicleId, bookingDateTime, BookingStatus.CONFIRMED);
    }

    // Cancels a booking. Throws IllegalArgumentException if not found.
    @SuppressWarnings("null")
    @Transactional
    public TestDriveBooking cancelBooking(Long bookingId) {
        TestDriveBooking booking = testDriveBookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No booking found with ID: " + bookingId));
        booking.setStatus(BookingStatus.CANCELLED);
        return testDriveBookingRepository.save(booking);
    }

    public List<TestDriveBooking> getUserBookings(Long userId) {
        return testDriveBookingRepository.findByUserId(userId);
    }
}
