package com.mbrm.payment.service;

import com.mbrm.payment.dto.OrderPaymentResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mbrm.payment.dto.CreatePaymentResponse;
import com.mbrm.payment.entity.Payment;
import com.mbrm.payment.enums.PaymentStatus;
import com.mbrm.payment.repository.PaymentRepository;

import com.mbrm.payment.client.OrderClient;

import com.razorpay.RazorpayClient;

import com.razorpay.Order;
import com.razorpay.Utils;

import lombok.RequiredArgsConstructor;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class PaymentService {

    @Value("${razorpay.webhook-secret}")
    private String webhookSecret;

    @Value("${razorpay.key}")
    private String razorpayKey;

    private final PaymentRepository paymentRepository;
    private final RazorpayClient razorpayClient;
    private final OrderClient orderClient;
    private final ObjectMapper objectMapper;

   public CreatePaymentResponse createPayment(Long orderId, String userEmail) {

    try {

        OrderPaymentResponse order = orderClient.getOrder(orderId);

        BigDecimal amount = order.getAmount();

        JSONObject options = new JSONObject();

        options.put("amount",
                amount.multiply(BigDecimal.valueOf(100)).intValue());

        options.put("currency", "INR");
        options.put("receipt", "order_" + orderId);

        Order razorpayOrder = razorpayClient.orders.create(options);

        String providerOrderId = razorpayOrder.get("id");

        Payment payment = Payment.builder()
                .orderId(orderId)
                .userEmail(userEmail != null ? userEmail : order.getUserEmail())
                .amount(amount)
                .provider("RAZORPAY")
                .providerOrderId(providerOrderId)
                .status(PaymentStatus.CREATED)
                .createdAt(LocalDateTime.now())
                .build();

       payment =  paymentRepository.save(payment);

        return CreatePaymentResponse.builder()
                .paymentId(payment.getId())
                .razorpayOrderId(providerOrderId)
                .key(razorpayKey)
                .amount(amount.multiply(BigDecimal.valueOf(100)).longValue())
                .currency("INR")
                .build();

        } 
        
        catch (Exception e) {
            throw new RuntimeException("Unable to create Razorpay order", e);
        }
    }
    public void handleWebhook(String payload, String signature) throws Exception {
        
        Utils.verifyWebhookSignature(payload, signature, webhookSecret);

        JsonNode root = objectMapper.readTree(payload);
        String event = root.get("event").asText();

        JsonNode entity = root.path("payload")
                          .path("payment")
                          .path("entity");

        String paymentId = entity.get("id").asText();
        String razorpayOrderId = entity.get("order_id").asText();

        Optional<Payment> optional = paymentRepository.findByProviderOrderId(razorpayOrderId);

        if (optional.isEmpty()) {
            System.out.println("Unknown Razorpay Order: " + razorpayOrderId);
            return;
        }

        Payment payment = optional.get();
        
        payment.setProviderPaymentId(paymentId);

        if ("payment.captured".equals(event)) {

            //making it idempotent, if the payment is already successful, we don't want to process it again
            if (payment.getStatus() == PaymentStatus.SUCCESS) {
                return;
            }
        
            payment.setProviderPaymentId(paymentId);
            payment.setStatus(PaymentStatus.SUCCESS);
            paymentRepository.save(payment);

            orderClient.confirmOrder(payment.getOrderId());

        } 

        else if ("payment.failed".equals(event)) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            orderClient.paymentFailed(payment.getOrderId());
        }

        else{
            System.out.println("Ignoring webhook event: " + event);
            return;
        }

    }

        
}