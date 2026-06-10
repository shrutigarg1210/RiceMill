//PRODUCT.JAVA — MAPS TO THE "PRODUCTS" TABLE

package com.grainmaster.demo.Model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
 
import java.math.BigDecimal;
import java.time.LocalDateTime;
 
@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(nullable = false, unique = true)
    private String name;
 
    @Column(nullable = false)
    private String grade;
 
    @Column(nullable = false)
    private String origin;
 
    @Column(name = "price_per_kg", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerKg;
    
    //Why BigDecimal? Because it provides better precision for financial calculations, avoiding rounding errors that can 
    // occur with floating-point types like double. This is especially important for prices and quantities in a grain trading
    // application where accuracy is crucial.
    
    @Column(columnDefinition = "TEXT")
    private String description;
 
    private String icon;
 
    @Column(nullable = false)
    private boolean available;
 
    @Column(name = "stock_quantity_mt", precision = 10, scale = 2)
    private BigDecimal stockQuantityMT;
 
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
 
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
 