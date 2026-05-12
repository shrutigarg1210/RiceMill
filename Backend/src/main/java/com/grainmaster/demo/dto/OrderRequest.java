package com.grainmaster.demo.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OrderRequest {
     @NotBlank(message = "Customer name is required")
    private String customerName;
 
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String customerEmail;
 
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number")
    private String customerPhone;
 
    private String companyName;
 
    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;
 
    @NotBlank(message = "Rice variety is required")
    private String riceVariety;
 
    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.1", message = "Minimum order is 0.1 MT")
    private BigDecimal quantityMT;
 
    private String notes;
}
