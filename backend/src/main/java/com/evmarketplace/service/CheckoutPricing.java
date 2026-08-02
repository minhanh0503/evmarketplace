package com.evmarketplace.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public final class CheckoutPricing {
    public static final BigDecimal HST_RATE = new BigDecimal("0.13");

    private CheckoutPricing() {
    }

    public static Amounts calculate(BigDecimal subtotal) {
        Objects.requireNonNull(subtotal, "subtotal must not be null");

        BigDecimal roundedSubtotal = subtotal.setScale(2, RoundingMode.HALF_UP);
        BigDecimal hst = roundedSubtotal
                .multiply(HST_RATE)
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = roundedSubtotal
                .add(hst)
                .setScale(2, RoundingMode.HALF_UP);

        return new Amounts(roundedSubtotal, hst, total);
    }

    public record Amounts(BigDecimal subtotal, BigDecimal hst, BigDecimal total) {
    }
}
