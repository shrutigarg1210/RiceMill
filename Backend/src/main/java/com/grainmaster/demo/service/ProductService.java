package com.grainmaster.demo.service;

import com.grainmaster.demo.Model.Product;
import com.grainmaster.demo.Repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getAvailableProducts() {
        return productRepository.findByAvailableTrue();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

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
