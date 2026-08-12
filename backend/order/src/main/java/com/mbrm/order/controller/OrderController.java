package com.mbrm.order.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mbrm.order.dto.CreateOrderRequest;
import com.mbrm.order.dto.OrderPaymentResponse;
import com.mbrm.order.dto.OrderResponse;
import com.mbrm.order.enums.OrderStatus;
import com.mbrm.order.service.OrderService;
import com.mbrm.order.util.JwtUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final JwtUtil jwtUtil;
    private final OrderService orderService;

    // Create order for logged-in user
    @PostMapping
    public ResponseEntity<OrderResponse> create(
            @Valid @RequestBody CreateOrderRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        String userEmail = null;

        if (authHeader != null &&
                authHeader.startsWith("Bearer ")) {

            userEmail = jwtUtil.extractEmail(authHeader.substring(7));
        }

        return ResponseEntity.ok(
                orderService.create(request, userEmail));
    }

    // Admin only (enforced by gateway)
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAll() {
        return ResponseEntity.ok(orderService.getAll());
    }

    @GetMapping("/{id}")
public ResponseEntity<OrderResponse> getById(
        @PathVariable Long id) {

    return ResponseEntity.ok(
            orderService.getById(id)
    );
}
    // Logged-in user can see only own orders
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> myOrders(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String userEmail = jwtUtil.extractEmail(token);
        return ResponseEntity.ok(orderService.getMyOrders(userEmail));
    }

    // Admin updates order status
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable Long id, @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }

    @GetMapping("/ping")
    public String ping() {
        return "order-controller-working";
    }

    @GetMapping("/payment-details/{id}")
    public ResponseEntity<OrderPaymentResponse> getPaymentDetails(
            @PathVariable Long id) {

        System.out.println("PAYMENT DETAILS CALLED " + id);

        return ResponseEntity.ok(orderService.getPaymentDetails(id));
    }

    // @GetMapping("/{id}/test")
    // public String test(@PathVariable Long id) {
    //     return "TEST " + id;
    // }

}
