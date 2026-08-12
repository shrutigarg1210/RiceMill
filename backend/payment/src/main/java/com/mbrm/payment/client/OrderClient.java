package com.mbrm.payment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;

import com.mbrm.payment.dto.OrderPaymentResponse;

@FeignClient(
        name = "order-service",
        url = "http://localhost:8083"
)

public interface OrderClient {

    @GetMapping("/orders/payment-details/{id}")
    OrderPaymentResponse getOrder(@PathVariable Long id);

    @PostMapping("/orders/{id}/confirm")
    void confirmOrder(@PathVariable Long id);

    @PostMapping("/orders/{id}/payment-failed")
    void paymentFailed(@PathVariable Long id);
}