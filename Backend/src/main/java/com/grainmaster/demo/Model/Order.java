package com.grainmaster.demo.Model;

// import java.math.BigDecimal;
// import java.time.LocalDateTime;

// import org.hibernate.annotations.CreationTimestamp;
// import org.hibernate.annotations.UpdateTimestamp;
// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.EnumType;
// import jakarta.persistence.Enumerated;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.Table;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// @Entity
// @Table(name = "orders")
// @Data
// @Builder
// @AllArgsConstructor 
// @NoArgsConstructor
// public class Order {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//       @Column(name = "order_number", unique = true, nullable = false)
//     private String orderNumber;
 
//     @Column(name = "customer_name", nullable = false)
//     private String customerName;
 
//     @Column(name = "customer_email", nullable = false)
//     private String customerEmail;
 
//     @Column(name = "customer_phone")
//     private String customerPhone;
 
//     @Column(name = "company_name")
//     private String companyName;
 
//     @Column(name = "delivery_address", columnDefinition = "TEXT")
//     private String deliveryAddress;
 
//     @Column(name = "rice_variety", nullable = false)
//     private String riceVariety;
 
//     @Column(name = "quantity_mt", nullable = false, precision = 10, scale = 2)
//     private BigDecimal quantityMT;
 
//     @Column(name = "price_per_kg", nullable = false, precision = 10, scale = 2)
//     private BigDecimal pricePerKg;
 
//     @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
//     private BigDecimal totalAmount;
 
//     @Enumerated(EnumType.STRING)
//     @Column(nullable = false)
//     @Builder.Default
//     private OrderStatus status = OrderStatus.PENDING;
 
//     @Column(name = "notes", columnDefinition = "TEXT")
//     private String notes;
 
//     @CreationTimestamp
//     @Column(name = "created_at", updatable = false)
//     private LocalDateTime createdAt;
 
//     @UpdateTimestamp
//     @Column(name = "updated_at")
//     private LocalDateTime updatedAt;
 
//     @Column(name = "expected_delivery")
//     private LocalDateTime expectedDelivery;
 
//     public enum OrderStatus {
//         PENDING, CONFIRMED, PROCESSING, DISPATCHED, DELIVERED, CANCELLED
//     }
// }


// FILE: src/main/java/com/grainmaster/demo/model/Order.java


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Table(name = "orders")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;

    // Link to registered user (null for guest orders)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "customer_name",  nullable = false) private String customerName;
    @Column(name = "customer_email", nullable = false) private String customerEmail;
    @Column(name = "customer_phone")                   private String customerPhone;
    @Column(name = "company_name")                     private String companyName;
    @Column(name = "delivery_address", columnDefinition = "TEXT") private String deliveryAddress;

    // Cart items stored as JSON string: [{"variety":"Basmati","qty":5,"pricePerKg":120},...]
    @Column(name = "cart_items", columnDefinition = "TEXT", nullable = false)
    private String cartItemsJson;

    @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "notes", columnDefinition = "TEXT") private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp
    @Column(name = "updated_at")                    private LocalDateTime updatedAt;
    @Column(name = "expected_delivery")             private LocalDateTime expectedDelivery;

    public enum OrderStatus {
        PENDING, CONFIRMED, PROCESSING, DISPATCHED, DELIVERED, CANCELLED
    }
}