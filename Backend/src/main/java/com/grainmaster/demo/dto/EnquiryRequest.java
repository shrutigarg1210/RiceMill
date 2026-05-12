// package com.grainmaster.demo.dto;

// import java.math.BigDecimal;

// import jakarta.validation.constraints.DecimalMin;
// import jakarta.validation.constraints.Email;
// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.Pattern;
// import jakarta.validation.constraints.Size;
// import lombok.Data;

// @Data
// public class EnquiryRequest {
//      @NotBlank(message = "Customer name is required")
//     @Size(min = 2, max = 100, message = "Name must be 2–100 characters")
//     private String customerName;
 
//     @Size(max = 150)
//     private String companyName;
 
//     @NotBlank(message = "Email is required")
//     @Email(message = "Invalid email format")
//     private String email;
 
//     @NotBlank(message = "Phone is required")
//     @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number")
//     private String phone;
 
//     @NotBlank(message = "Rice variety is required")
//     private String riceVariety;
 
//     @DecimalMin(value = "0.1", message = "Quantity must be at least 0.1 MT")
//     private BigDecimal quantityMT;
 
//     @Size(max = 1000)
//     private String additionalRequirements;
// }


package com.grainmaster.demo.dto;
 
import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;
 
@Data
public class EnquiryRequest {
 
    @NotBlank(message = "Name is required")
    private String customerName;
 
    private String companyName;
 
    @NotBlank @Email(message = "Invalid email")
    private String email;
 
    @NotBlank
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone")
    private String phone;
 
    // MULTIPLE varieties supported
    @NotEmpty(message = "Select at least one variety")
    private List<String> riceVarieties;
 
    // Optional quantity per variety
    private List<EnquiryVarietyDetail> quantityDetails;
 
    private String additionalRequirements;
 
    private Long userId;
 
    @Data
    public static class EnquiryVarietyDetail {
        private String variety;
        private Double quantityMT;
    }
}
