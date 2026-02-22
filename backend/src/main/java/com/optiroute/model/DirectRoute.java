package com.optiroute.model;

import jakarta.persistence.*;

@Entity
@Table(name = "direct_routes")
public class DirectRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "from_location_id", nullable = false)
    private Location fromLocation;

    @ManyToOne
    @JoinColumn(name = "to_location_id", nullable = false)
    private Location toLocation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransportType transportType;

    @Column(nullable = false)
    private Integer durationMinutes;

    @Column(nullable = false)
    private Double cost;

    @Column(nullable = true)
    private String operator;

    @Column(nullable = true)
    private java.time.LocalDate date;

    @Column(nullable = false)
    private Integer capacity = 40; // Default capacity

    @OneToMany(mappedBy = "directRoute", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.List<RouteStop> stops = new java.util.ArrayList<>();

    // --- Constructors ---

    public DirectRoute() {
    }

    public DirectRoute(Long id, Location fromLocation, Location toLocation,
            TransportType transportType, Integer durationMinutes, Double cost) {
        this.id = id;
        this.fromLocation = fromLocation;
        this.toLocation = toLocation;
        this.transportType = transportType;
        this.durationMinutes = durationMinutes;
        this.cost = cost;
    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Location getFromLocation() {
        return fromLocation;
    }

    public void setFromLocation(Location fromLocation) {
        this.fromLocation = fromLocation;
    }

    public Location getToLocation() {
        return toLocation;
    }

    public void setToLocation(Location toLocation) {
        this.toLocation = toLocation;
    }

    public TransportType getTransportType() {
        return transportType;
    }

    public void setTransportType(TransportType transportType) {
        this.transportType = transportType;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public java.time.LocalDate getDate() {
        return date;
    }

    public void setDate(java.time.LocalDate date) {
        this.date = date;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public java.util.List<RouteStop> getStops() {
        return stops;
    }

    public void setStops(java.util.List<RouteStop> stops) {
        this.stops = stops;
    }
}