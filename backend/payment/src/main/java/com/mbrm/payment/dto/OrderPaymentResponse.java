package com.mbrm.payment.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderPaymentResponse {

    private Long orderId;
    private String userEmail;
    private BigDecimal amount;
    private String status;
}