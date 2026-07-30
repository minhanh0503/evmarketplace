package com.evmarketplace.controller;

import com.evmarketplace.dto.CheckoutRequest;
import com.evmarketplace.model.Order;
import com.evmarketplace.model.OrderItem;
import com.evmarketplace.service.AnalyticsService;
import com.evmarketplace.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private AnalyticsService analyticsService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request, HttpServletRequest httpRequest) {
        try {
            Order order = orderService.checkout(request.getUserId());
    
            if (order.getStatus() == Order.Status.CONFIRMED)
                for (OrderItem item : order.getItems())
                    analyticsService.recordVisitEvent(httpRequest.getRemoteAddr(), item.getVehicleId(), "PURCHASE");

            return ResponseEntity.ok(order);
        }

        catch (IllegalStateException e) {
            // e.g. empty cart
            return ResponseEntity.badRequest().body(errorResponse(e.getMessage()));
        }

        catch (IllegalArgumentException e) {
            // e.g. user not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(orderService.getOrder(orderId));
        }

        catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse(e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    private Map<String, Object> errorResponse(String message) {
        return Map.of("success", false, "message", message);
    }
}