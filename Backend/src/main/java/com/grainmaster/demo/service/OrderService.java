package com.grainmaster.demo.service;
 
import com.fasterxml.jackson.databind.ObjectMapper;
import com.grainmaster.demo.dto.*;
import com.grainmaster.demo.Model.Order;
import com.grainmaster.demo.Model.Product;
import com.grainmaster.demo.Repository.OrderRepository;
import com.grainmaster.demo.Repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
 
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
 
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    // OrderService dependencies
    //OrderService needs all four repositories because placing an order touches multiple tables: reads cart items, reads products (for stock and price), 
    // creates an order + order items, clears the cart. All of this must happen atomically — either all of it succeeds or none of it does.
    private final OrderRepository   orderRepository;
    private final ProductRepository productRepository;
    private final EmailService      emailService;
    private final ObjectMapper      objectMapper = new ObjectMapper();
 
    // Place order from cart (multiple items)
    public Order placeOrder(PlaceOrderRequest req) {
        // Calculate total from cart items, validate each variety exists
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : req.getCartItems()) {
            Product p = productRepository.findByName(item.getVariety())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getVariety()));
            item.setPricePerKg(p.getPricePerKg());
            item.setIcon(p.getIcon());
            // Determine requested quantity in kilograms
            java.math.BigDecimal qtyKg = BigDecimal.ZERO;
            if (item.getQuantity() != null) {
                String unit = item.getUnit() == null ? "kg" : item.getUnit().trim().toLowerCase();
                switch (unit) {
                    case "mt":
                    case "metric_ton":
                    case "metric_tonne":
                        // 1 MT = 1000 kg
                        qtyKg = item.getQuantity().multiply(BigDecimal.valueOf(1000));
                        break;
                    case "kg":
                        qtyKg = item.getQuantity();
                        break;
                    case "g":
                        qtyKg = item.getQuantity().divide(BigDecimal.valueOf(1000));
                        break;
                    case "lb":
                    case "lbs":
                        // 1 lb = 0.45359237 kg
                        qtyKg = item.getQuantity().multiply(BigDecimal.valueOf(0.45359237));
                        break;
                    default:
                        // Unknown unit - assume kg
                        qtyKg = item.getQuantity();
                        break;
                }
            } else if (item.getQuantityMT() != null) {
                // Backwards compatibility: quantityMT is in metric tonnes
                qtyKg = item.getQuantityMT().multiply(BigDecimal.valueOf(1000));
            } else {
                throw new RuntimeException("Cart item is missing quantity for " + item.getVariety());
            }

            BigDecimal lineTotal = p.getPricePerKg().multiply(qtyKg);
            total = total.add(lineTotal);
        }
 
        String cartJson;
        try { cartJson = objectMapper.writeValueAsString(req.getCartItems()); }
        catch (Exception e) { cartJson = "[]"; }
 
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .userId(req.getUserId())
                .customerName(req.getCustomerName())
                .customerEmail(req.getCustomerEmail())
                .customerPhone(req.getCustomerPhone())
                .companyName(req.getCompanyName())
                .deliveryAddress(req.getDeliveryAddress())
                .cartItemsJson(cartJson)
                .totalAmount(total)
                .notes(req.getNotes())
                .status(Order.OrderStatus.PENDING)
                .expectedDelivery(LocalDateTime.now().plusDays(7))
                .build();
 
        Order saved = orderRepository.save(order);
        log.info("Order placed: #{} Total=₹{}", saved.getOrderNumber(), saved.getTotalAmount());
 
        emailService.sendOrderConfirmationToCustomer(saved);
        emailService.sendOrderAlertToAdmin(saved);
        return saved;
    }
 
    public List<Order> getAllOrders() { return orderRepository.findAll(); }
 
    public List<Order> getOrdersByUserId(Long userId) { return orderRepository.findByUserId(userId); }
 
    public Order getOrderByNumber(String num) {
        return orderRepository.findByOrderNumber(num)
                .orElseThrow(() -> new RuntimeException("Order not found: " + num));
    }
 
    public List<Order> getOrdersByEmail(String email) { return orderRepository.findByCustomerEmail(email); }
 
    public Order updateStatus(Long id, Order.OrderStatus status) {
        Order o = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        o.setStatus(status);
        return orderRepository.save(o);
    }
 
    private String generateOrderNumber() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int rand = 1000 + new Random().nextInt(9000);
        return "GM-" + date + "-" + rand;
    }
}
 