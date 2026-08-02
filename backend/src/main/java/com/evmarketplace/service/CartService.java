package com.evmarketplace.service;

import com.evmarketplace.model.CartItem;
import com.evmarketplace.model.Vehicle;
import com.evmarketplace.repository.CartItemRepository;
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

    public CartItem addToCart(
            Long userId,
            Long vehicleId,
            Integer quantity
    ) {
        Objects.requireNonNull(
                userId,
                "userId must not be null"
        );

        Objects.requireNonNull(
                vehicleId,
                "vehicleId must not be null"
        );

        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException(
                    "Quantity must be at least 1"
            );
        }

        boolean alreadyInCart =
                cartItemRepository
                        .findByUserIdAndVehicleId(
                                userId,
                                vehicleId
                        )
                        .isPresent();

        if (alreadyInCart) {
            throw new IllegalStateException(
                    "This vehicle is already in your cart"
            );
        }

        Vehicle vehicle =
                vehicleRepository.findById(vehicleId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Vehicle not found: "
                                                + vehicleId
                                )
                        );

        BigDecimal effectivePrice =
                vehicle.getDiscount() != null
                        ? vehicle.getPrice().subtract(
                                vehicle.getDiscount()
                        )
                        : vehicle.getPrice();

        CartItem item = new CartItem(
                userId,
                vehicleId,
                quantity,
                effectivePrice
        );

        return cartItemRepository.save(item);
    }

    public List<CartItem> getCartByUser(Long userId) {
        Objects.requireNonNull(
                userId,
                "userId must not be null"
        );

        return cartItemRepository.findByUserId(userId);
    }

    public void removeCartItem(Long cartItemId) {
        Objects.requireNonNull(
                cartItemId,
                "cartItemId must not be null"
        );

        cartItemRepository.deleteById(cartItemId);
    }

    public void clearCart(Long userId) {
        Objects.requireNonNull(
                userId,
                "userId must not be null"
        );

        cartItemRepository.deleteByUserId(userId);
    }

    @SuppressWarnings("null")
    public BigDecimal calculateCartTotal(Long userId) {
        Objects.requireNonNull(
                userId,
                "userId must not be null"
        );

        return cartItemRepository
                .findByUserId(userId)
                .stream()
                .map(item ->
                        item.getUnitPrice().multiply(
                                BigDecimal.valueOf(
                                        item.getQuantity()
                                )
                        )
                )
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                );
    }
}
