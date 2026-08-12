package com.mbrm.order.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {

    @NotBlank
    private String customerName;

    @Email
    @NotBlank
    private String customerEmail;

    @NotBlank
    private String customerPhone;

    private String companyName;

    private String gstNumber;

    @NotBlank
    private String deliveryAddress;

    private String notes;

    @Valid
    @NotEmpty
    private List<CreateOrderItemRequest> items;
}