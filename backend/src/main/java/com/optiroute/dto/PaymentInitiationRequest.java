package com.optiroute.dto;

public class PaymentInitiationRequest {
    private Long routeId;

    // Default Constructor
    public PaymentInitiationRequest() {
    }

    // All Arguments Constructor
    public PaymentInitiationRequest(Long routeId) {
        this.routeId = routeId;
    }

    // Getter
    public Long getRouteId() {
        return routeId;
    }

    // Setter
    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }
}