package com.optiroute.service;

import com.optiroute.dto.BookingRequest;
import com.optiroute.model.Booking;
import com.optiroute.model.DirectRoute;
import com.optiroute.model.User;
import com.optiroute.repository.BookingRepository;
import com.optiroute.repository.DirectRouteRepository;
import com.optiroute.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.optiroute.model.RouteStop;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

        @Autowired
        private BookingRepository bookingRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private DirectRouteRepository directRouteRepository;

        @Transactional
        public Booking createBooking(String userEmail, BookingRequest request) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

                DirectRoute route = directRouteRepository.findById(request.getRouteId())
                                .orElseThrow(() -> new RuntimeException("Route not found: " + request.getRouteId()));

                // 1. Identify User Segment
                int startOrder = 0;
                int endOrder = 1; // Default for direct routes without stops

                String fromCity = request.getFromCity() != null ? request.getFromCity()
                                : route.getFromLocation().getName();
                String toCity = request.getToCity() != null ? request.getToCity() : route.getToLocation().getName();

                if (!route.getStops().isEmpty()) {
                        Integer sOrder = null;
                        Integer eOrder = null;
                        int maxOrder = 0;

                        for (RouteStop stop : route.getStops()) {
                                if (stop.getStopOrder() > maxOrder)
                                        maxOrder = stop.getStopOrder();

                                String stopName = stop.getLocation().getName().toLowerCase();
                                if (fromCity != null && stopName.startsWith(fromCity.toLowerCase())) {
                                        sOrder = stop.getStopOrder();
                                }
                                if (toCity != null && stopName.startsWith(toCity.toLowerCase())) {
                                        eOrder = stop.getStopOrder();
                                }
                        }

                        if (sOrder != null && eOrder != null) {
                                startOrder = sOrder;
                                endOrder = eOrder;
                        } else {
                                if (startOrder == 0 && endOrder == 1 && route.getStops().size() > 0) {
                                        // Assume default start/end if fully matched
                                        endOrder = maxOrder;
                                }
                        }
                }

                if (startOrder >= endOrder) {
                        throw new RuntimeException("Invalid route segment: Start order must be before end order.");
                }

                // 2. Check Segment Capacity
                List<Booking> existingBookings = bookingRepository
                                .findByDirectRouteAndStatusAndJourneyDate(route, "CONFIRMED", request.getJourneyDate());

                for (int k = startOrder; k < endOrder; k++) {
                        final int segmentIndex = k;
                        long occupied = existingBookings.stream().filter(b -> {
                                int bStart = b.getFromStopOrder() != null ? b.getFromStopOrder() : 0;
                                int bEnd = b.getToStopOrder() != null ? b.getToStopOrder() : 1;
                                return bStart <= segmentIndex && bEnd > segmentIndex;
                        }).count();

                        if (occupied >= route.getCapacity()) {
                                throw new RuntimeException("Capacity exceeded for segment: " + segmentIndex);
                        }
                }

                Booking booking = Booking.builder()
                                .user(user)
                                .directRoute(route)
                                .fromCity(fromCity)
                                .toCity(toCity)
                                .journeyDate(request.getJourneyDate())
                                .transportType(route.getTransportType().name())
                                .cost(route.getCost())
                                .durationMinutes(route.getDurationMinutes())
                                .operator(route.getOperator())
                                .status("CONFIRMED")
                                .bookingTime(LocalDateTime.now())
                                .fromStopOrder(startOrder)
                                .toStopOrder(endOrder)
                                .build();

                return bookingRepository.save(booking);
        }

        public List<Booking> getUserBookings(String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

                return bookingRepository.findByUserOrderByBookingTimeDesc(user);
        }
}
