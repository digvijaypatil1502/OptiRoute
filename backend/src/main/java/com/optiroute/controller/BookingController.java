package com.optiroute.controller;

import com.optiroute.dto.BookingRequest;
import com.optiroute.dto.BookingResponse;
import com.optiroute.model.Booking;
import com.optiroute.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Helper to get email from Security Context
    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            String email = getCurrentUserEmail();
            Booking booking = bookingService.createBooking(email, request);
            return ResponseEntity.ok(new BookingResponse(booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating booking: " + e.getMessage());
        }
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<?> getUserBookings() {
        try {
            String email = getCurrentUserEmail();
            List<Booking> bookings = bookingService.getUserBookings(email);

            // Map raw Entities to DTOs to avoid JSON cyclic dependencies (User -> Booking
            // -> User)
            List<BookingResponse> responseList = bookings.stream()
                    .map(BookingResponse::new)
                    .collect(java.util.stream.Collectors.toList());

            return ResponseEntity.ok(responseList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching bookings: " + e.getMessage());
        }
    }
}
