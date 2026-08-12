package com.mbrm.order.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import lombok.RequiredArgsConstructor;
import com.mbrm.order.repository.OrderRepository;
import com.mbrm.order.repository.OrderItemRepository;
import com.mbrm.order.client.ProductClient;
import com.mbrm.order.dto.OrderResponse;
import com.mbrm.order.entity.Order;
import com.mbrm.order.entity.OrderItem;
import com.mbrm.order.enums.OrderStatus;
import com.mbrm.order.dto.CreateOrderItemRequest;
import com.mbrm.order.dto.CreateOrderRequest;
import com.mbrm.order.dto.OrderPaymentResponse;

import java.util.List;

import com.mbrm.order.dto.OrderItemResponse;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor

public class OrderService {

        @Value("${pricing.gst}")
        private BigDecimal gstPercentage;

        @Value("${pricing.delivery-charge}")
        private BigDecimal deliveryCharge;

        @Value("${pricing.free-delivery-above}")
        private BigDecimal freeDeliveryAbove;
        private final OrderRepository orderRepository;
        private final ProductClient productClient;
        private final OrderItemRepository orderItemRepository;

        public OrderResponse create(CreateOrderRequest request, String userEmail) {

                Order order = Order.builder()
                                .userEmail(userEmail) // null for guest checkout
                                .customerName(request.getCustomerName())
                                .customerEmail(request.getCustomerEmail())
                                .customerPhone(request.getCustomerPhone())
                                .companyName(request.getCompanyName())
                                .gstNumber(request.getGstNumber())
                                .deliveryAddress(request.getDeliveryAddress())
                                .notes(request.getNotes())
                                .status(OrderStatus.PENDING_PAYMENT)
                                .totalAmount(BigDecimal.ZERO)
                                .build();

                BigDecimal subtotal = BigDecimal.ZERO;

                for (CreateOrderItemRequest itemRequest : request.getItems()) {

                        Map<String, Object> product = productClient.getProduct(itemRequest.getProductId());

                        BigDecimal pricePerKg = new BigDecimal(product.get("pricePerKg").toString());

                        BigDecimal itemSubtotal = pricePerKg.multiply(itemRequest.getQuantityKg());

                        OrderItem item = OrderItem.builder()
                                        .order(order)
                                        .productId(itemRequest.getProductId())
                                        .productName(product.get("variety").toString())
                                        .qualityGrade(product.get("qualityGrade").toString())
                                        .imageUrl(
                                                        product.get("imageUrl") == null
                                                                        ? null
                                                                        : product.get("imageUrl").toString())
                                        .quantityKg(itemRequest.getQuantityKg())
                                        .pricePerKg(pricePerKg)
                                        .subtotal(itemSubtotal)
                                        .build();

                        order.getItems().add(item);

                        subtotal = subtotal.add(itemSubtotal);
                }

                BigDecimal gstAmount = subtotal.multiply(gstPercentage);

                BigDecimal calculatedDeliveryCharge = subtotal.compareTo(freeDeliveryAbove) >= 0
                                ? BigDecimal.ZERO
                                : this.deliveryCharge;

                BigDecimal grandTotal = subtotal
                                .add(gstAmount)
                                .add(calculatedDeliveryCharge);
                order.setSubtotal(subtotal);

                order.setGstAmount(gstAmount);

                order.setDeliveryCharge(calculatedDeliveryCharge);

                order.setTotalAmount(grandTotal);
                Order savedOrder = orderRepository.save(order);

                return toResponse(savedOrder);
        }

        public void confirmPayment(Long orderId) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // Reserve stock for every product in the order
                for (OrderItem item : order.getItems()) {

                        productClient.reserveStock(
                                        item.getProductId(),
                                        item.getQuantityKg());
                }

                order.setStatus(OrderStatus.CONFIRMED);

                orderRepository.save(order);
        }

        public void paymentFailed(Long orderId) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                order.setStatus(OrderStatus.PAYMENT_FAILED);

                orderRepository.save(order);
        }

        public List<OrderResponse> getAll() {

                return orderRepository.findAll()

                                .stream()

                                .map(this::toResponse)

                                .toList();
        }

        public List<OrderResponse> getMyOrders(String userEmail) {

                return orderRepository

                                .findByUserEmailOrderByCreatedAtDesc(userEmail)

                                .stream()

                                .map(this::toResponse)

                                .toList();
        }

        public OrderPaymentResponse getPaymentDetails(Long orderId) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                return OrderPaymentResponse.builder()
                                .orderId(order.getId())
                                .userEmail(order.getUserEmail())
                                .amount(order.getTotalAmount())
                                .status(order.getStatus().name())
                                .build();
        }

        public OrderResponse updateStatus(Long id, OrderStatus status) {

                Order order = orderRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // Restore stock if a confirmed order is cancelled
                if (status == OrderStatus.CANCELLED
                                && order.getStatus() == OrderStatus.CONFIRMED) {

                        for (OrderItem item : order.getItems()) {

                                productClient.restoreStock(
                                                item.getProductId(),
                                                item.getQuantityKg());
                        }
                }

                order.setStatus(status);

                return toResponse(orderRepository.save(order));
        }

        private OrderResponse toResponse(Order order) {

                List<OrderItemResponse> items = order.getItems()
                                .stream()
                                .map(item -> OrderItemResponse.builder()
                                                .productId(item.getProductId())
                                                .quantityKg(item.getQuantityKg())
                                                .pricePerKg(item.getPricePerKg())
                                                .subtotal(order.getSubtotal())
                                                .gstAmount(order.getGstAmount())
                                                .deliveryCharge(order.getDeliveryCharge())
                                                .totalAmount(order.getTotalAmount())
                                                .build())
                                .toList();

                return OrderResponse.builder()
                                .id(order.getId())
                                .orderNumber(order.getOrderNumber())

                                .userEmail(order.getUserEmail())

                                .customerName(order.getCustomerName())
                                .customerEmail(order.getCustomerEmail())
                                .customerPhone(order.getCustomerPhone())

                                .companyName(order.getCompanyName())
                                .gstNumber(order.getGstNumber())

                                .deliveryAddress(order.getDeliveryAddress())
                                .notes(order.getNotes())

                                .totalAmount(order.getTotalAmount())

                                .status(order.getStatus())

                                .createdAt(order.getCreatedAt())

                                .items(items)

                                .build();
        }

        private OrderItemResponse toItemResponse(OrderItem item) {
                return OrderItemResponse.builder()
                                .productId(item.getProductId())
                                .quantityKg(item.getQuantityKg())
                                .pricePerKg(item.getPricePerKg())
                                .subtotal(item.getSubtotal())
                                .productName(item.getProductName())
                                .qualityGrade(item.getQualityGrade())
                                .imageUrl(item.getImageUrl())
                                .build();
        }

        public OrderResponse getById(Long id) {

                Order order = orderRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                return toResponse(order);
        }
}
