package com.grainmaster.demo.dto;


import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;
 
@Data
public class PlaceOrderRequest {
    @NotBlank  private String customerName;
    @NotBlank @Email private String customerEmail;
    @NotBlank  private String customerPhone;
    private String companyName;
    @NotBlank  private String deliveryAddress;
    private String notes;
 
    @NotEmpty(message = "Cart cannot be empty")
    private List<CartItem> cartItems;
 
    private Long userId; // optional — set by backend from JWT
}
 