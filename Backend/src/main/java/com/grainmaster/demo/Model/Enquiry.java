package com.grainmaster.demo.Model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity //marks this class as a database table
@Table(name = "enquiries")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Enquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")      private Long userId;
    @Column(name = "customer_name", nullable = false) private String customerName;
    @Column(name = "company_name")                    private String companyName;
    @Column(nullable = false)                          private String email;
    @Column(nullable = false)                          private String phone;

    // Stored as comma-separated or JSON: "Basmati,Sona Masoori,Brown Rice"
    @Column(name = "rice_varieties", nullable = false, columnDefinition = "TEXT")
    private String riceVarieties;

    // Quantities per variety as JSON: [{"variety":"Basmati","quantityMT":5},...]
    @Column(name = "quantity_details", columnDefinition = "TEXT")
    private String quantityDetails;

    @Column(name = "additional_requirements", columnDefinition = "TEXT")
    private String additionalRequirements;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EnquiryStatus status = EnquiryStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false) private LocalDateTime createdAt;
    @Column(name = "resolved_at")                   private LocalDateTime resolvedAt;

    public enum EnquiryStatus { PENDING, CONTACTED, QUOTED, CLOSED }
}