package com.evmarketplace.service;

import com.evmarketplace.entity.CartItem;
import com.evmarketplace.entity.Order;
import com.evmarketplace.entity.OrderItem;
import com.evmarketplace.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    @Autowired private OrderRepository orderRepository;
    @Autowired private CartService cartService;
    @Autowired private PaymentService paymentService;

    @Transactional
    public Order checkout(Long userId) {
        List<CartItem> cartItems = cartService.getCartByUser(userId);
        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cart is empty for user " + userId);
        }

        BigDecimal total = cartService.calculateCartTotal(userId);

        Order order = new Order();
        order.setUserId(userId);
        order.setTotalAmount(total);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(Order.Status.PENDING);

        for (CartItem ci : cartItems) {
            OrderItem item = new OrderItem(order, ci.getVehicleId(), ci.getQuantity(), ci.getUnitPrice());
            order.getItems().add(item);
        }

        Order savedOrder = orderRepository.save(order);

        boolean approved = paymentService.processPayment(userId, savedOrder.getId());
        savedOrder.setStatus(approved ? Order.Status.CONFIRMED : Order.Status.DENIED);
        orderRepository.save(savedOrder);

        if (approved)
            cartService.clearCart(userId);

        return savedOrder;
    }

    public Order getOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}