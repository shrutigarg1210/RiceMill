package com.mbrm.payment.controller;

import com.mbrm.payment.dto.CreatePaymentRequest;
import com.mbrm.payment.dto.CreatePaymentResponse;
import com.mbrm.payment.service.PaymentService;
import com.mbrm.payment.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {
    private final PaymentService paymentService;
    private final JwtUtil jwtUtil;

   @PostMapping("/create")
public ResponseEntity<CreatePaymentResponse> create(
        @Valid @RequestBody CreatePaymentRequest request,
        @RequestHeader(value = "Authorization", required = false)
        String authHeader) {

    String email = null;

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        email = jwtUtil.extractEmail(authHeader.substring(7));
    }

    return ResponseEntity.ok(
            paymentService.createPayment(
                    request.getOrderId(),
                    email
            ));
}

    @PostMapping("/webhook")
    public ResponseEntity<String> webhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature)
            throws Exception {

        paymentService.handleWebhook(payload, signature);

        return ResponseEntity.ok("Webhook Received");
    }
}