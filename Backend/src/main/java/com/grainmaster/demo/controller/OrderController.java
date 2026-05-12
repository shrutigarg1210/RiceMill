package com.grainmaster.demo.controller;

// import com.grainmaster.demo.dto.ApiResponse;
// import com.grainmaster.demo.dto.OrderRequest;
// import com.grainmaster.demo.Model.Order;
// import com.grainmaster.demo.service.OrderService;
// import jakarta.validation.Valid;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/orders")
// @RequiredArgsConstructor
// public class OrderController {

//     private final OrderService orderService;

//     // POST /api/orders              → place a new order
//     @PostMapping
//     public ResponseEntity<ApiResponse<Order>> placeOrder(
//             @Valid @RequestBody OrderRequest request) {
//         Order order = orderService.placeOrder(request);
//         return ResponseEntity.ok(ApiResponse.ok(
//             "Order placed! Your order number is " + order.getOrderNumber(), order));
//     }

//     // GET /api/orders               → all orders (admin)
//     @GetMapping
//     public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
//         return ResponseEntity.ok(ApiResponse.ok("Orders fetched", orderService.getAllOrders()));
//     }

//     // GET /api/orders/track/{orderNumber}
//     @GetMapping("/track/{orderNumber}")
//     public ResponseEntity<ApiResponse<Order>> trackOrder(@PathVariable String orderNumber) {
//         Order order = orderService.getOrderByNumber(orderNumber);
//         return ResponseEntity.ok(ApiResponse.ok("Order found", order));
//     }

//     // GET /api/orders/customer?email=...
//     @GetMapping("/customer")
//     public ResponseEntity<ApiResponse<List<Order>>> getByCustomer(@RequestParam String email) {
//         return ResponseEntity.ok(ApiResponse.ok("Customer orders", orderService.getOrdersByEmail(email)));
//     }

//     // PUT /api/orders/{id}/status   → update status (admin)
//     @PutMapping("/{id}/status")
//     public ResponseEntity<ApiResponse<Order>> updateStatus(
//             @PathVariable Long id,
//             @RequestParam Order.OrderStatus status) {
//         Order updated = orderService.updateOrderStatus(id, status);
//         return ResponseEntity.ok(ApiResponse.ok("Order status updated", updated));
//     }
// }


import com.grainmaster.demo.Config.JwtUtil;
import com.grainmaster.demo.dto.ApiResponse;
import com.grainmaster.demo.dto.PlaceOrderRequest;
import com.grainmaster.demo.Model.Order;
import com.grainmaster.demo.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
 
import java.util.List;
 
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {
 
    private final OrderService orderService;
    private final JwtUtil      jwtUtil;
 
    // ── POST /api/orders — public, works for guests AND logged-in users ──
    @PostMapping
    public ResponseEntity<ApiResponse<Order>> placeOrder(
            @Valid @RequestBody PlaceOrderRequest req,
            HttpServletRequest httpReq) {
 
        // Attach userId from JWT if user is logged in
        String header = httpReq.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            try {
                req.setUserId(jwtUtil.getUserId(header.substring(7)));
                log.info("Order placed by logged-in user ID: {}", req.getUserId());
            } catch (Exception e) {
                log.warn("Could not extract userId from token: {}", e.getMessage());
            }
        }
 
        Order order = orderService.placeOrder(req);
        return ResponseEntity.ok(ApiResponse.ok(
            "Order placed! Your order number is " + order.getOrderNumber(), order));
    }
 
    // ── GET /api/orders/track/{orderNumber} — public ──────────────────────
    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<ApiResponse<Order>> track(@PathVariable String orderNumber) {
        Order order = orderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.ok("Order found", order));
    }
 
    // ── GET /api/orders/my — requires login ───────────────────────────────
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Order>>> myOrders(HttpServletRequest req) {
        String header = req.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(ApiResponse.error("Please login to view your orders"));
        }
        Long userId = jwtUtil.getUserId(header.substring(7));
        return ResponseEntity.ok(ApiResponse.ok("Your orders", orderService.getOrdersByUserId(userId)));
    }
 
    // ── GET /api/orders/all — ADMIN only ──────────────────────────────────
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Order>>> allOrders() {
        return ResponseEntity.ok(ApiResponse.ok("All orders", orderService.getAllOrders()));
    }
 
    // ── GET /api/orders/customer?email=... — public ───────────────────────
    @GetMapping("/customer")
    public ResponseEntity<ApiResponse<List<Order>>> byEmail(@RequestParam String email) {
        return ResponseEntity.ok(ApiResponse.ok("Orders by email", orderService.getOrdersByEmail(email)));
    }
 
    // ── PUT /api/orders/{id}/status — ADMIN only ──────────────────────────
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateStatus(
            @PathVariable Long id,
            @RequestParam Order.OrderStatus status) {
        return ResponseEntity.ok(ApiResponse.ok("Status updated to " + status, orderService.updateStatus(id, status)));
    }
}
 