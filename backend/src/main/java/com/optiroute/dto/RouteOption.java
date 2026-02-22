package com.optiroute.dto;

import java.io.Serializable;

public class RouteOption implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long routeId;
    private String transportType;
    private Integer durationMinutes;
    private Double cost;
    private Double efficiencyScore;
    private String operator;

    // --- Constructors ---
    public RouteOption() {
    }

    public RouteOption(Long routeId, String transportType, Integer durationMinutes, Double cost, Double efficiencyScore,
            String operator) {
        this.routeId = routeId;
        this.transportType = transportType;
        this.durationMinutes = durationMinutes;
        this.cost = cost;
        this.efficiencyScore = efficiencyScore;
        this.operator = operator;
    }

    // --- Getters ---
    public Long getRouteId() {
        return routeId;
    }

    public String getTransportType() {
        return transportType;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public Double getCost() {
        return cost;
    }

    public Double getEfficiencyScore() {
        return efficiencyScore;
    }

    public String getOperator() {
        return operator;
    }

    // --- Setters ---
    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public void setTransportType(String transportType) {
        this.transportType = transportType;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public void setEfficiencyScore(Double efficiencyScore) {
        this.efficiencyScore = efficiencyScore;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    // --- Manual Builder Implementation ---
    public static RouteOptionBuilder builder() {
        return new RouteOptionBuilder();
    }

    public static class RouteOptionBuilder {
        private Long routeId;
        private String transportType;
        private Integer durationMinutes;
        private Double cost;
        private Double efficiencyScore;
        private String operator;

        public RouteOptionBuilder routeId(Long routeId) {
            this.routeId = routeId;
            return this;
        }

        public RouteOptionBuilder transportType(String transportType) {
            this.transportType = transportType;
            return this;
        }

        public RouteOptionBuilder durationMinutes(Integer durationMinutes) {
            this.durationMinutes = durationMinutes;
            return this;
        }

        public RouteOptionBuilder operator(String operator) {
            this.operator = operator;
            return this;
        }

        public RouteOptionBuilder cost(Double cost) {
            this.cost = cost;
            return this;
        }

        public RouteOptionBuilder efficiencyScore(Double efficiencyScore) {
            this.efficiencyScore = efficiencyScore;
            return this;
        }

        public RouteOption build() {
            return new RouteOption(routeId, transportType, durationMinutes, cost, efficiencyScore, operator);
        }
    }
}