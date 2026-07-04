package com.evmarketplace.service;

import com.evmarketplace.entity.CartItem;
import com.evmarketplace.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Service
public class CartService {
    @Autowired
    private CartItemRepository cartItemRepository;

    public CartItem addToCart(Long userId, Long vehicleId, Integer quantity, BigDecimal unitPrice) {
        CartItem item = new CartItem(userId, vehicleId, quantity, unitPrice);

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