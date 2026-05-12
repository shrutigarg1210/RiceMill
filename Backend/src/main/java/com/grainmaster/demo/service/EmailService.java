// FILE: src/main/java/com/grainmaster/demo/service/EmailService.java
package com.grainmaster.demo.service;

import com.grainmaster.demo.Model.Enquiry;
import com.grainmaster.demo.Model.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.admin-email}")
    private String adminEmail;

    @Value("${app.name}")
    private String appName;

    // ─── ENQUIRY EMAILS ──────────────────────────────────────

    public void sendEnquiryConfirmationToCustomer(Enquiry enquiry) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(enquiry.getEmail());
            msg.setSubject("Enquiry Received – " + appName);
            msg.setText(
                "Dear " + enquiry.getCustomerName() + ",\n\n" +
                "Thank you for your enquiry!\n\n" +
                "Details Submitted:\n" +
                "  • Varieties : " + enquiry.getRiceVarieties() + "\n" +
                "  • Company   : " + (enquiry.getCompanyName() != null ? enquiry.getCompanyName() : "N/A") + "\n" +
                (enquiry.getAdditionalRequirements() != null
                    ? "  • Notes     : " + enquiry.getAdditionalRequirements() + "\n"
                    : "") +
                "\nOur sales team will contact you within 24 hours.\n\n" +
                "Warm regards,\n" + appName
            );
            mailSender.send(msg);
            log.info("Enquiry confirmation sent to {}", enquiry.getEmail());
        } catch (Exception e) {
            log.error("Failed to send enquiry confirmation: {}", e.getMessage());
        }
    }

    public void sendEnquiryAlertToAdmin(Enquiry enquiry) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(adminEmail);
            msg.setSubject("New Enquiry #" + enquiry.getId() + " – " + enquiry.getCustomerName());
            msg.setText(
                "New enquiry received:\n\n" +
                "  Name      : " + enquiry.getCustomerName() + "\n" +
                "  Company   : " + (enquiry.getCompanyName() != null ? enquiry.getCompanyName() : "N/A") + "\n" +
                "  Email     : " + enquiry.getEmail() + "\n" +
                "  Phone     : " + enquiry.getPhone() + "\n" +
                "  Varieties : " + enquiry.getRiceVarieties() + "\n" +
                "  Notes     : " + (enquiry.getAdditionalRequirements() != null ? enquiry.getAdditionalRequirements() : "None") + "\n\n" +
                "Login to the admin panel to follow up."
            );
            mailSender.send(msg);
            log.info("Enquiry admin alert sent for #{}", enquiry.getId());
        } catch (Exception e) {
            log.error("Failed to send admin enquiry alert: {}", e.getMessage());
        }
    }

    // ─── ORDER EMAILS ─────────────────────────────────────────

    public void sendOrderConfirmationToCustomer(Order order) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(order.getCustomerEmail());
            msg.setSubject("Order Confirmed – " + order.getOrderNumber());
            msg.setText(
                "Dear " + order.getCustomerName() + ",\n\n" +
                "Your order has been successfully placed!\n\n" +
                "Order Details:\n" +
                "  Order No   : " + order.getOrderNumber() + "\n" +
                "  Total      : ₹" + order.getTotalAmount() + "\n" +
                "  Address    : " + order.getDeliveryAddress() + "\n" +
                "  Delivery By: " + (order.getExpectedDelivery() != null
                                        ? order.getExpectedDelivery().toLocalDate()
                                        : "Within 7 days") + "\n\n" +
                "Items Ordered:\n" + order.getCartItemsJson() + "\n\n" +
                "Use your order number to track delivery on our website.\n\n" +
                "Warm regards,\n" + appName
            );
            mailSender.send(msg);
            log.info("Order confirmation sent to {}", order.getCustomerEmail());
        } catch (Exception e) {
            log.error("Failed to send order confirmation: {}", e.getMessage());
        }
    }

    public void sendOrderAlertToAdmin(Order order) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(adminEmail);
            msg.setSubject("New Order " + order.getOrderNumber() + " – " + order.getCustomerName());
            msg.setText(
                "New order received:\n\n" +
                "  Order No  : " + order.getOrderNumber() + "\n" +
                "  Customer  : " + order.getCustomerName() + "\n" +
                "  Email     : " + order.getCustomerEmail() + "\n" +
                "  Phone     : " + (order.getCustomerPhone() != null ? order.getCustomerPhone() : "N/A") + "\n" +
                "  Total     : ₹" + order.getTotalAmount() + "\n" +
                "  Address   : " + order.getDeliveryAddress() + "\n" +
                "  Items     : " + order.getCartItemsJson() + "\n" +
                "  Notes     : " + (order.getNotes() != null ? order.getNotes() : "None") + "\n\n" +
                "Please confirm and begin processing."
            );
            mailSender.send(msg);
            log.info("Order admin alert sent for #{}", order.getOrderNumber());
        } catch (Exception e) {
            log.error("Failed to send admin order alert: {}", e.getMessage());
        }
    }
}