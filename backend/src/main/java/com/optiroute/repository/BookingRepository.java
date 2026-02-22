package com.optiroute.repository;

import com.optiroute.model.Booking;
import com.optiroute.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);

    List<Booking> findByUserOrderByBookingTimeDesc(User user);

    java.util.List<Booking> findByDirectRouteAndStatus(com.optiroute.model.DirectRoute directRoute, String status);

    java.util.List<Booking> findByDirectRouteAndStatusAndJourneyDate(com.optiroute.model.DirectRoute directRoute,
            String status, java.time.LocalDate journeyDate);

    long countByDirectRouteAndStatus(com.optiroute.model.DirectRoute directRoute, String status);
}
