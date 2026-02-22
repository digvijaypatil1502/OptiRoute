package com.optiroute.dto;

import com.optiroute.model.Booking;

import java.time.LocalDateTime;

public class BookingResponse {
    private Long id;
    private String fromCity;
    private String toCity;
    private String journeyDate;
    private Double cost;
    private Integer durationMinutes;
    private String transportType;
    private String operator;
    private String status;
    private LocalDateTime bookingTime;

    public BookingResponse(Booking booking) {
        this.id = booking.getId();
        this.fromCity = booking.getFromCity();
        this.toCity = booking.getToCity();
        this.journeyDate = booking.getJourneyDate() != null ? booking.getJourneyDate().toString() : null;
        this.cost = booking.getDirectRoute() != null ? booking.getDirectRoute().getCost() : 0.0;
        this.durationMinutes = booking.getDirectRoute() != null ? booking.getDirectRoute().getDurationMinutes() : 0;
        this.transportType = booking.getDirectRoute() != null && booking.getDirectRoute().getTransportType() != null
                ? booking.getDirectRoute().getTransportType().name()
                : "UNKNOWN";
        this.operator = booking.getDirectRoute() != null ? booking.getDirectRoute().getOperator() : "";
        this.status = booking.getStatus();
        this.bookingTime = booking.getBookingTime();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getFromCity() {
        return fromCity;
    }

    public String getToCity() {
        return toCity;
    }

    public String getJourneyDate() {
        return journeyDate;
    }

    public Double getCost() {
        return cost;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public String getTransportType() {
        return transportType;
    }

    public String getOperator() {
        return operator;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getBookingTime() {
        return bookingTime;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setFromCity(String fromCity) {
        this.fromCity = fromCity;
    }

    public void setToCity(String toCity) {
        this.toCity = toCity;
    }

    public void setJourneyDate(String journeyDate) {
        this.journeyDate = journeyDate;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public void setTransportType(String transportType) {
        this.transportType = transportType;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setBookingTime(LocalDateTime bookingTime) {
        this.bookingTime = bookingTime;
    }
}
