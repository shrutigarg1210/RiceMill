package com.mbrm.product.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {

    private String variety;
    private String description;
    private BigDecimal pricePerKg;
    private BigDecimal availableQuantityKg;
    private String qualityGrade;
    private String imageUrl;
}