package com.optiroute.controller;

import com.optiroute.dto.PaymentInitiationRequest;
import com.optiroute.dto.PaymentRedirectResponse;
import com.optiroute.service.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    //  Initiate payment
    @PostMapping("/initiate")
    public ResponseEntity<PaymentRedirectResponse> initiatePayment(
            @RequestBody PaymentInitiationRequest request) {

        PaymentRedirectResponse response =
                paymentService.initiatePayment(request.getRouteId());

        return ResponseEntity.ok(response);
    }

    //  Confirm payment (SUCCESS)
    @PostMapping("/confirm/{paymentId}")
    public ResponseEntity<String> confirmPayment(
            @PathVariable Long paymentId) {

        paymentService.confirmPayment(paymentId);
        return ResponseEntity.ok("PAYMENT_CONFIRMED");
    }

    //  Mark payment as FAILED
    @PostMapping("/fail/{paymentId}")
    public ResponseEntity<String> failPayment(
            @PathVariable Long paymentId) {

        paymentService.failPayment(paymentId);
        return ResponseEntity.ok("PAYMENT_FAILED");
    }

    //  Retry failed payment
    @PostMapping("/retry/{paymentId}")
    public ResponseEntity<PaymentRedirectResponse> retryPayment(
            @PathVariable Long paymentId) {

        PaymentRedirectResponse response =
                paymentService.retryPayment(paymentId);

        return ResponseEntity.ok(response);
    }
}
