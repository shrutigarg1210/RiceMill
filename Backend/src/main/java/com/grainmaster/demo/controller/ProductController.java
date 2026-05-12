// package com.grainmaster.demo.controller;

// import com.grainmaster.demo.dto.ApiResponse;
// import com.grainmaster.demo.Model.Product;
// import com.grainmaster.demo.service.ProductService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/products")
// @RequiredArgsConstructor
// public class ProductController {

//     private final ProductService productService;

//     // GET /api/products           → all products
//     @GetMapping
//     public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
//         List<Product> products = productService.getAllProducts();
//         return ResponseEntity.ok(ApiResponse.ok("Products fetched successfully", products));
//     }

//     // GET /api/products/available → only available products
//     @GetMapping("/available")
//     public ResponseEntity<ApiResponse<List<Product>>> getAvailableProducts() {
//         List<Product> products = productService.getAvailableProducts();
//         return ResponseEntity.ok(ApiResponse.ok("Available products fetched", products));
//     }

//     // GET /api/products/{id}
//     @GetMapping("/{id}")
//     public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable Long id) {
//         Product product = productService.getProductById(id);
//         return ResponseEntity.ok(ApiResponse.ok("Product found", product));
//     }

//     // POST /api/products          → create product (admin)
//     @PostMapping
//     public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Product product) {
//         Product created = productService.createProduct(product);
//         return ResponseEntity.ok(ApiResponse.ok("Product created", created));
//     }

//     // PUT /api/products/{id}      → update product (admin)
//     @PutMapping("/{id}")
//     public ResponseEntity<ApiResponse<Product>> updateProduct(
//             @PathVariable Long id,
//             @RequestBody Product product) {
//         Product updated = productService.updateProduct(id, product);
//         return ResponseEntity.ok(ApiResponse.ok("Product updated", updated));
//     }

//     // DELETE /api/products/{id}   → delete product (admin)
//     @DeleteMapping("/{id}")
//     public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
//         productService.deleteProduct(id);
//         return ResponseEntity.ok(ApiResponse.ok("Product deleted", null));
//     }
// }

package com.grainmaster.demo.controller;
 
import com.grainmaster.demo.dto.ApiResponse;
import com.grainmaster.demo.Model.Product;
import com.grainmaster.demo.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
 
import java.util.List;
 
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
 
    private final ProductService productService;
 
    // ── GET /api/products — PUBLIC ─────────────────────────────────────────
    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        return ResponseEntity.ok(ApiResponse.ok("Products fetched", productService.getAllProducts()));
    }
 
    // ── GET /api/products/available — PUBLIC ───────────────────────────────
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<Product>>> getAvailableProducts() {
        return ResponseEntity.ok(ApiResponse.ok("Available products fetched", productService.getAvailableProducts()));
    }
 
    // ── GET /api/products/{id} — PUBLIC ────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Product found", productService.getProductById(id)));
    }
 
    // ── POST /api/products — ADMIN only ────────────────────────────────────
    @PostMapping
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(ApiResponse.ok("Product created", productService.createProduct(product)));
    }
 
    // ── PUT /api/products/{id} — ADMIN only ────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {
        return ResponseEntity.ok(ApiResponse.ok("Product updated", productService.updateProduct(id, product)));
    }
 
    // ── DELETE /api/products/{id} — ADMIN only ─────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok("Product deleted", null));
    }
}
 