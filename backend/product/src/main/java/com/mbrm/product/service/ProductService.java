package com.mbrm.product.service;

import com.mbrm.product.dto.*;
import com.mbrm.product.entity.Product;
import com.mbrm.product.exception.InsufficientStockException;
import com.mbrm.product.exception.ProductNotFoundException;
import com.mbrm.product.kafka.InventoryEventProducer;
import com.mbrm.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final InventoryEventProducer eventProducer;

    public ProductResponse create(ProductRequest request) {

        Product product = Product.builder()
                .variety(request.getVariety())
                .description(request.getDescription())
                .pricePerKg(request.getPricePerKg())
                .availableQuantityKg(request.getAvailableQuantityKg())
                .qualityGrade(request.getQualityGrade())
                .imageUrl(request.getImageUrl())
                .build();

        return toResponse(productRepository.save(product));
    }

    public List<ProductResponse> getAllActive() {
        return productRepository.findByActiveTrue()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse getById(Long id) {
        return toResponse(find(id));
    }

    public ProductResponse update(Long id, ProductRequest request) {

        Product product = find(id);

        product.setVariety(request.getVariety());
        product.setDescription(request.getDescription());
        product.setPricePerKg(request.getPricePerKg());
        product.setAvailableQuantityKg(request.getAvailableQuantityKg());
        product.setQualityGrade(request.getQualityGrade());
        product.setImageUrl(request.getImageUrl());

        return toResponse(productRepository.save(product));
    }

    public void delete(Long id) {
        Product product = find(id);
        product.setActive(false);
        productRepository.save(product);
    }

    public ProductResponse updateStock(Long id, BigDecimal quantityKg) {

        Product product = productRepository.findById(id)
                .orElseThrow(ProductNotFoundException::new);
        product.setAvailableQuantityKg(quantityKg);

        return toResponse(productRepository.save(product));
    }

    // Internal API for order-service
    public void reserveStock(Long id, BigDecimal quantityKg) {

        Product product = find(id);

        if (product.getAvailableQuantityKg().compareTo(quantityKg) < 0) {
            throw new InsufficientStockException();
        }

        product.setAvailableQuantityKg(
                product.getAvailableQuantityKg().subtract(quantityKg)
        );

        productRepository.save(product);

        // eventProducer.stockUpdated(id, product.getAvailableQuantityKg().toString());
    }

    public void restoreStock(Long id, BigDecimal quantityKg) {

    Product product = find(id);

    product.setAvailableQuantityKg(
            product.getAvailableQuantityKg().add(quantityKg)
    );

    productRepository.save(product);

    eventProducer.stockUpdated(id, product.getAvailableQuantityKg().toString());
}

    private Product find(Long id) {
        return productRepository.findById(id)
                .orElseThrow(ProductNotFoundException::new);
    }

    private ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .variety(p.getVariety())
                .description(p.getDescription())
                .pricePerKg(p.getPricePerKg())
                .availableQuantityKg(p.getAvailableQuantityKg())
                .qualityGrade(p.getQualityGrade())
                .imageUrl(p.getImageUrl())
                .active(p.getActive())
                .build();
    }
}