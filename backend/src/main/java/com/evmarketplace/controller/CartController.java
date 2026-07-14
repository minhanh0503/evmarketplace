package com.evmarketplace.controller;

import com.evmarketplace.dto.AddToCartRequest;
import com.evmarketplace.model.CartItem;
import com.evmarketplace.service.AnalyticsService;
import com.evmarketplace.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @Autowired
    private AnalyticsService analyticsService;

    @PostMapping("/add")
    public CartItem addToCart(@RequestBody AddToCartRequest request, HttpServletRequest httpRequest) {
        CartItem item = cartService.addToCart(
            request.getUserId(), request.getVehicleId(),
            request.getQuantity(), request.getUnitPrice()
        );
        analyticsService.recordVisitEvent(httpRequest.getRemoteAddr(), request.getVehicleId(), "CART");
        return item;
    }

    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable Long userId) {
        return cartService.getCartByUser(userId);
    }

    @DeleteMapping("/remove/{cartItemId}")
    public void removeItem(@PathVariable Long cartItemId) {
        cartService.removeCartItem(cartItemId);
    }

    @DeleteMapping("/clear/{userId}")
    public void clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
    }
}