package com.optiroute.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "direct_route_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private DirectRoute directRoute;

    private String fromCity;
    private String toCity;

    @Column(name = "from_stop_order")
    private Integer fromStopOrder;

    @Column(name = "to_stop_order")
    private Integer toStopOrder;

    private LocalDate journeyDate;
    private String transportType;
    private Double cost;
    private Integer durationMinutes;
    private String operator;

    private String status; // "CONFIRMED", "CANCELLED"

    private LocalDateTime bookingTime;
}
