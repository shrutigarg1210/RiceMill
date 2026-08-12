package com.mbrm.order.enums;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public enum OrderStatus {
   PENDING_PAYMENT,
PAID,
CONFIRMED,
SHIPPED,
DELIVERED,
PAYMENT_FAILED,
CANCELLED
}


// PENDING	
// Order created, payment/stock not fully completed yet.
// CONFIRMED	
// Stock reserved and payment successful.
// SHIPPED	
// Order handed over for delivery.
// DELIVERED	
// Customer received the order.
// CANCELLED	
// Order cancelled; stock should be restored if already reserved.