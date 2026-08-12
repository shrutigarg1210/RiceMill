package com.mbrm.order.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long productId;

    private BigDecimal quantityKg;

    private BigDecimal pricePerKg;

    private BigDecimal subtotal;

    private BigDecimal gstAmount;

    private BigDecimal deliveryCharge;

    private BigDecimal totalAmount;
    private String productName;

private String qualityGrade;

private String imageUrl;
}
