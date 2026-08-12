package com.mbrm.product.controller;

import com.mbrm.product.dto.*;
import com.mbrm.product.service.ProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    // CUSTOMER APIs

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAll() {
        return ResponseEntity.ok(productService.getAllActive());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    // ADMIN APIs

    @PostMapping
    public ResponseEntity<ProductResponse> create(@RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(
            @PathVariable Long id,
            @RequestBody ProductRequest request) {

        return ResponseEntity.ok(productService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<ProductResponse> updateStock(
            @PathVariable Long id, @Valid
            @RequestBody StockUpdateRequest request) {

        return ResponseEntity.ok(
                productService.updateStock(id, request.getQuantityKg())
        );
    }

    // INTERNAL API (Order Service)
@PostMapping("/{id}/reserve") public ResponseEntity<Void> reserve( 
    @PathVariable Long id, @RequestParam BigDecimal quantityKg) 
{ productService.reserveStock(id, quantityKg); 
    return ResponseEntity.ok().build(); 
}

@PatchMapping("/{id}/restore")
public ResponseEntity<Void> restore(
        @PathVariable Long id,
        @RequestParam BigDecimal quantityKg) {

    productService.restoreStock(id, quantityKg);
    return ResponseEntity.ok().build();
}
}