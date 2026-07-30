package com.evmarketplace.service;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CheckoutPricingTest {

    @Test
    void calculatesThirteenPercentHstAndFinalTotal() {
        CheckoutPricing.Amounts amounts =
                CheckoutPricing.calculate(new BigDecimal("57999.00"));

        assertEquals(new BigDecimal("57999.00"), amounts.subtotal());
        assertEquals(new BigDecimal("7539.87"), amounts.hst());
        assertEquals(new BigDecimal("65538.87"), amounts.total());
    }

    @Test
    void roundsHstToTwoDecimalPlacesUsingHalfUpRounding() {
        CheckoutPricing.Amounts amounts =
                CheckoutPricing.calculate(new BigDecimal("10.05"));

        assertEquals(new BigDecimal("10.05"), amounts.subtotal());
        assertEquals(new BigDecimal("1.31"), amounts.hst());
        assertEquals(new BigDecimal("11.36"), amounts.total());
    }
}
