package com.evmarketplace.service;

import com.evmarketplace.model.CartItem;
import com.evmarketplace.model.Order;
import com.evmarketplace.model.OrderItem;
import com.evmarketplace.model.User;
import com.evmarketplace.repository.OrderRepository;
import com.evmarketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class OrderService {
    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CartService cartService;
    @Autowired private PaymentService paymentService;
    @Autowired private NotificationService notificationService;

    @Transactional
    public Order checkout(Long userId) {
        Objects.requireNonNull(userId, "userId must not be null");
        List<CartItem> cartItems = cartService.getCartByUser(userId);

        if (cartItems.isEmpty())
            throw new IllegalStateException("Cart is empty for user " + userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        BigDecimal total = cartService.calculateCartTotal(userId);

        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(total);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(Order.Status.PENDING);

        for (CartItem ci : cartItems) {
            OrderItem item = new OrderItem(order, ci.getVehicle(), ci.getQuantity(), ci.getUnitPrice());
            order.getItems().add(item);
        }

        Order savedOrder = orderRepository.save(order);

        boolean approved = paymentService.processPayment(userId, savedOrder.getId());
        savedOrder.setStatus(approved ? Order.Status.CONFIRMED : Order.Status.DENIED);
        orderRepository.save(savedOrder);

        if (approved) {
            notificationService.sendOrderConfirmation(userId, savedOrder.getId());
            cartService.clearCart(userId);
        }

        return savedOrder;
    }

    public Order getOrder(Long orderId) {
        Objects.requireNonNull(orderId, "orderId must not be null");

        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
    }

    public List<Order> getOrdersByUser(Long userId) {
        Objects.requireNonNull(userId, "userId must not be null");

        return orderRepository.findByUserId(userId);
    }
}