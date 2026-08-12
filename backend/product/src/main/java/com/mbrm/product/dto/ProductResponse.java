package com.mbrm.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String variety;
    private String description;
    private BigDecimal pricePerKg;
    private BigDecimal availableQuantityKg;
    private String qualityGrade;
    private String imageUrl;
    private Boolean active;
}