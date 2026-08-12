package com.mbrm.order.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderPaymentResponse {
    private Long orderId;
    private String userEmail;
    private BigDecimal amount;
    private String status;
}
