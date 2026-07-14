package com.evmarketplace.controller;

import com.evmarketplace.dto.CheckoutRequest;
import com.evmarketplace.model.Order;
import com.evmarketplace.model.OrderItem;
import com.evmarketplace.service.AnalyticsService;
import com.evmarketplace.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private AnalyticsService analyticsService;

    @PostMapping("/checkout")
    public Order checkout(@RequestBody CheckoutRequest request, HttpServletRequest httpRequest) {
        Order order = orderService.checkout(request.getUserId());
        if (order.getStatus() == Order.Status.CONFIRMED) {
            for (OrderItem item : order.getItems()) {
                analyticsService.recordVisitEvent(httpRequest.getRemoteAddr(), item.getVehicleId(), "PURCHASE");
            }
        }
        return order;
    }

    @GetMapping("/{orderId}")
    public Order getOrder(@PathVariable Long orderId) {
        return orderService.getOrder(orderId);
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }
}