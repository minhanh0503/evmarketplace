package com.evmarketplace.service;

import com.evmarketplace.model.CartItem;
import com.evmarketplace.model.User;
import com.evmarketplace.model.Vehicle;
import com.evmarketplace.repository.CartItemRepository;
import com.evmarketplace.repository.UserRepository;
import com.evmarketplace.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Service
public class CartService {
    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserRepository userRepository;

    public CartItem addToCart(Long userId, Long vehicleId, Integer quantity) {
        Objects.requireNonNull(userId, "userId must not be null");
        Objects.requireNonNull(vehicleId, "vehicleId must not be null");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found: " + vehicleId));

        BigDecimal effectivePrice = vehicle.getDiscount() != null
                ? vehicle.getPrice().subtract(vehicle.getDiscount())
                : vehicle.getPrice();

        CartItem item = new CartItem(user, vehicle, quantity, effectivePrice);

        return cartItemRepository.save(item);
    }

    public List<CartItem> getCartByUser(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    public void removeCartItem(Long cartItemId) {
        Objects.requireNonNull(cartItemId, "cartItemId must not be null");
        cartItemRepository.deleteById(cartItemId);
    }

    public void clearCart(Long userId) {
        Objects.requireNonNull(userId, "userId must not be null");
        cartItemRepository.deleteByUserId(userId);
    }

    @SuppressWarnings("null") // false positive: BigDecimal.ZERO seed + BigDecimal.add() never produce null
    public BigDecimal calculateCartTotal(Long userId) {
        Objects.requireNonNull(userId, "userId must not be null");

        return cartItemRepository.findByUserId(userId).stream()
                .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}