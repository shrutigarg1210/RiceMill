package com.mbrm.payment.entity;

import com.mbrm.payment.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Entity
@Table(name = "payments")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;

    private String userEmail;

    private BigDecimal amount;

    private String provider;

    private String providerOrderId;

    private String providerPaymentId;
    @Enumerated(EnumType.STRING)

    private PaymentStatus status;
    
    private LocalDateTime createdAt;

    // Getters and Setters
}