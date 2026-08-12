package com.mbrm.payment.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreatePaymentResponse {
    private Long paymentId;
    private String razorpayOrderId;
    private String key;
    private Long amount;
    private String currency;
}