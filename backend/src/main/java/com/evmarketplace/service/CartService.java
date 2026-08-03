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
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * @param unitPrice optional override (e.g. configurator). If null, uses
     *                  vehicle price minus discount.
     */
    public CartItem addToCart(
            Long userId,
            Long vehicleId,
            Integer quantity,
            BigDecimal unitPrice
    ) {
        Objects.requireNonNull(userId, "userId must not be null");
        Objects.requireNonNull(vehicleId, "vehicleId must not be null");

        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found: " + vehicleId));

        Optional<CartItem> existing =
                cartItemRepository.findByUser_IdAndVehicle_Id(userId, vehicleId);

        if (existing.isPresent()) {
            // Increment quantity instead of failing (better UX for "add multiple")
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        }

        BigDecimal effectivePrice = unitPrice;
        if (effectivePrice == null) {
            effectivePrice = vehicle.getDiscount() != null
                    ? vehicle.getPrice().subtract(vehicle.getDiscount())
                    : vehicle.getPrice();
        }

        CartItem item = new CartItem(user, vehicle, quantity, effectivePrice);
        return cartItemRepository.save(item);
    }

    /** Convenience overload if callers only pass 3 args */
    public CartItem addToCart(Long userId, Long vehicleId, Integer quantity) {
        return addToCart(userId, vehicleId, quantity, null);
    }

    public List<CartItem> getCartByUser(Long userId) {
        Objects.requireNonNull(userId, "userId must not be null");
        return cartItemRepository.findByUser_Id(userId);
    }

    public void removeCartItem(Long cartItemId) {
        Objects.requireNonNull(cartItemId, "cartItemId must not be null");
        cartItemRepository.deleteById(cartItemId);
    }

    public void clearCart(Long userId) {
        Objects.requireNonNull(userId, "userId must not be null");
        cartItemRepository.deleteByUser_Id(userId);
    }

    public BigDecimal calculateCartTotal(Long userId) {
        Objects.requireNonNull(userId, "userId must not be null");

        return cartItemRepository.findByUser_Id(userId).stream()
                .map(item -> item.getUnitPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}