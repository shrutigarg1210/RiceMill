package com.mbrm.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@FeignClient(name = "product-service", url = "http://localhost:8082")
public interface ProductClient {
    
      @GetMapping("/products/{id}")
    Map<String, Object> getProduct(@PathVariable Long id);

    @PostMapping("/products/{id}/reserve")
    void reserveStock(@PathVariable Long id,@RequestParam BigDecimal quantityKg);
    
  @PostMapping("/products/{id}/restore")
    void restoreStock(@PathVariable Long id,
                      @RequestParam BigDecimal quantityKg);
}
