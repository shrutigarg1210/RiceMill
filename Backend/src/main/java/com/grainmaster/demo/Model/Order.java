//ORDER.JAVA — MAPS TO THE "ORDERS" TABLE


package com.grainmaster.demo.Model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.grainmaster.demo.Model.Order.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

//Order entity
//Represents one customer order. An order belongs to one user and contains multiple products. This is the parent in a
// one-to-many relationship with OrderItem.
@Entity
@Table(name = "orders")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Order {

    // //tells Hibernate to let MySQL handle ID generation using AUTO_INCREMENT. 
    // So when you insert a new user, you don't provide an ID — MySQL assigns the
    //  next available integer automatically.

//  Other strategies: SEQUENCE (PostgreSQL), TABLE (database-agnostic but slow), 
// AUTO (Hibernate decides). IDENTITY is correct for MySQL.
    @Id //Primary key
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
    
    //Order status as enum
    // OrderStatus enum: PENDING → CONFIRMED → SHIPPED → DELIVERED (or CANCELLED). Stored as a string. The service layer 
    // updates this status as the order progresses. An admin API changes PENDING to CONFIRMED, then CONFIRMED to SHIPPED etc.
    public enum OrderStatus {
        PENDING, CONFIRMED, PROCESSING, DISPATCHED, DELIVERED, CANCELLED
    }
}


//@ManyToOne(fetch = FetchType.LAZY)
// @JoinColumn(name = "user_id", nullable = false)
// private User user;
// @ManyToOne — many orders belong to one user ⭐
// @ManyToOne declares the relationship direction: many Order rows → one User row.

// @JoinColumn(name="user_id") — creates a user_id column in the orders table that holds the foreign key referencing users.id

// fetch = FetchType.LAZY — do NOT load the User object when you load an Order. Only load it if you explicitly call 
// order.getUser(). This is the correct default — you don't always need the full user object when fetching orders, 
// and loading it unnecessarily wastes a DB query.

//@OneToMany(mappedBy = "order",
//            cascade = CascadeType.ALL,
//            fetch = FetchType.LAZY)
// private List<OrderItem> items = new ArrayList<>();
// @OneToMany — one order has many items ⭐
// mappedBy = "order" — tells Hibernate: the foreign key is on the OrderItem side (in the order field of OrderItem). 
// Don't create a join table — just look at order_items.order_id.

// cascade = CascadeType.ALL — when you save/delete an Order, automatically save/delete all its OrderItems too. So you just
// call orderRepository.save(order) and all items are saved with it.

// fetch = FetchType.LAZY — don't load all items when loading an order. This is where N+1 problems come from if you're not 
// careful. Only load items when explicitly accessed.