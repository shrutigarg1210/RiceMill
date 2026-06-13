package com.grainmaster.demo.service;

import com.grainmaster.demo.Model.Product;
import com.grainmaster.demo.Repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

// @RequiredArgsConstructor
// This is a Lombok annotation. Lombok reads your final fields at compile time and automatically generates a constructor
//  that accepts all of them as parameters. So instead of you writing:
// public ProductService(ProductRepository productRepository) {
//     this.productRepository = productRepository;
// }
// Lombok writes it for you invisibly. Spring sees that constructor and injects the ProductRepository bean through it. This is constructor injection — cleaner than @Autowired on a field.

public class ProductService {

    private final ProductRepository productRepository;

    @Cacheable(value = "allProducts")
    @CacheEvict(value = "allProducts", allEntries = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    @Cacheable(value = "availableProducts")
    @CacheEvict(value = "availableProducts", allEntries = true)
    public List<Product> getAvailableProducts() {
        return productRepository.findByAvailableTrue();
    }
    @Cacheable(value = "products", key = "#id")
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
     @CacheEvict(value = "allProducts", allEntries = true)
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
     @CacheEvict(value = "products", key = "#id")
    public Product updateProduct(Long id, Product updatedProduct) {
        Product existing = getProductById(id);
        existing.setName(updatedProduct.getName());
        existing.setGrade(updatedProduct.getGrade());
        existing.setOrigin(updatedProduct.getOrigin());
        existing.setPricePerKg(updatedProduct.getPricePerKg());
        existing.setDescription(updatedProduct.getDescription());
        existing.setAvailable(updatedProduct.isAvailable());
        existing.setStockQuantityMT(updatedProduct.getStockQuantityMT());
        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}


// @CacheEvict — remove stale cache on update ⭐
// When a product is updated, the cached version in Redis is now stale — it has the old data. @CacheEvict(value="products", key="#id") deletes that cache entry when this method runs. The next call to getProductById(id) finds no cache, hits MySQL for fresh data, and re-populates the cache.

// If you forget @CacheEvict, users see outdated product data until the cache TTL expires — a classic cache consistency bug.

// We load the existing product first (findById), update only the changed fields, then save. This way unchanged fields (like createdAt, imageUrl) are preserved.