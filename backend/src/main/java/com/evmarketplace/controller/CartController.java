// CartController.java
package com.evmarketplace.controller;

import com.evmarketplace.entity.CartItem;
import com.evmarketplace.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public CartItem addToCart(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        Long vehicleId = Long.valueOf(body.get("vehicleId").toString());
        Integer quantity = Integer.valueOf(body.get("quantity").toString());
        BigDecimal unitPrice = new BigDecimal(body.get("unitPrice").toString());

        return cartService.addToCart(userId, vehicleId, quantity, unitPrice);
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