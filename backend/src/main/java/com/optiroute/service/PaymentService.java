package com.optiroute.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.optiroute.dto.PaymentRedirectResponse;
import com.optiroute.model.DirectRoute;
import com.optiroute.model.Payment;
import com.optiroute.model.PaymentStatus;
import com.optiroute.repository.DirectRouteRepository;
import com.optiroute.repository.PaymentRepository;

@Service
public class PaymentService {

    @Autowired
    private DirectRouteRepository directRouteRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    // Initiate payment
    public PaymentRedirectResponse initiatePayment(Long routeId) {

        DirectRoute route = directRouteRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        Payment payment = new Payment();
        payment.setRouteId(routeId);
        payment.setAmount(route.getCost());
        payment.setStatus(PaymentStatus.PENDING);

        payment = paymentRepository.save(payment);

        return PaymentRedirectResponse.builder()
                .paymentUrl("/payment?paymentId=" + payment.getId())
                .routeId(routeId)
                .amount(route.getCost())
                .paymentId(payment.getId())
                .build();
    }

    // Confirm payment
    @Transactional
    public Payment confirmPayment(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            return payment; // idempotent
        }

        payment.setStatus(PaymentStatus.SUCCESS);
        return paymentRepository.save(payment);
    }

    // Mark payment as FAILED
    @Transactional
    public Payment failPayment(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            throw new RuntimeException("Payment already successful");
        }

        payment.setStatus(PaymentStatus.FAILED);
        return paymentRepository.save(payment);
    }

    // Retry failed payment
    @Transactional
    public PaymentRedirectResponse retryPayment(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() != PaymentStatus.FAILED) {
            throw new RuntimeException("Only failed payments can be retried");
        }

        payment.setStatus(PaymentStatus.RETRY);
        paymentRepository.save(payment);

        return PaymentRedirectResponse.builder()
                .paymentUrl("/payment?paymentId=" + payment.getId())
                .routeId(payment.getRouteId())
                .amount(payment.getAmount())
                .build();
    }
}
