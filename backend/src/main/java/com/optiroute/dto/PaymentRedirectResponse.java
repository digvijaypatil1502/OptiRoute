package com.optiroute.dto;

public class PaymentRedirectResponse {
    private String paymentUrl;
    private Long routeId;
    private Double amount;
    private Long paymentId;

    // Default Constructor
    public PaymentRedirectResponse() {
    }

    // All-Args Constructor
    public PaymentRedirectResponse(String paymentUrl, Long routeId, Double amount, Long paymentId) {
        this.paymentUrl = paymentUrl;
        this.routeId = routeId;
        this.amount = amount;
        this.paymentId = paymentId;
    }

    // Getters
    public String getPaymentUrl() {
        return paymentUrl;
    }

    public Long getRouteId() {
        return routeId;
    }

    public Double getAmount() {
        return amount;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    // Setters
    public void setPaymentUrl(String paymentUrl) {
        this.paymentUrl = paymentUrl;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    // --- Manual Builder Implementation ---
    public static PaymentRedirectResponseBuilder builder() {
        return new PaymentRedirectResponseBuilder();
    }

    public static class PaymentRedirectResponseBuilder {
        private String paymentUrl;
        private Long routeId;
        private Double amount;
        private Long paymentId;

        public PaymentRedirectResponseBuilder paymentUrl(String paymentUrl) {
            this.paymentUrl = paymentUrl;
            return this;
        }

        public PaymentRedirectResponseBuilder routeId(Long routeId) {
            this.routeId = routeId;
            return this;
        }

        public PaymentRedirectResponseBuilder amount(Double amount) {
            this.amount = amount;
            return this;
        }

        public PaymentRedirectResponseBuilder paymentId(Long paymentId) {
            this.paymentId = paymentId;
            return this;
        }

        public PaymentRedirectResponse build() {
            return new PaymentRedirectResponse(paymentUrl, routeId, amount, paymentId);
        }
    }
}