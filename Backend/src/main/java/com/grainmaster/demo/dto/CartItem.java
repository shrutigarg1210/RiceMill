package com.grainmaster.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
 
@Data @NoArgsConstructor @AllArgsConstructor
public class CartItem {
    private String     variety;
    // New generic quantity and optional unit (e.g. "MT", "kg", "g", "lb").
    // Backwards-compatible field kept below for existing clients.
    private BigDecimal quantity;    
    private String     unit;

    // Backwards compatibility: older clients may still send quantityMT (metric tonnes)
    private BigDecimal quantityMT;

    private BigDecimal pricePerKg;
    private String     icon;
}
 