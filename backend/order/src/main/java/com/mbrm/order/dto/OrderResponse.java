package com.mbrm.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.mbrm.order.enums.OrderStatus;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;
import java.util.ArrayList;
import lombok.AllArgsConstructor;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
     private Long id;

    private String orderNumber;

    private String userEmail;

    private String customerName;

    private String customerEmail;

    private String customerPhone;

    private String companyName;

    private String gstNumber;

    private String deliveryAddress;

    private String notes;

    private BigDecimal totalAmount;

    private OrderStatus status;

    private LocalDateTime createdAt;

    private List<OrderItemResponse> items;
}
