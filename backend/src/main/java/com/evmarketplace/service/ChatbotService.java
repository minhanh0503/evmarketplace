package com.evmarketplace.service;

import com.evmarketplace.dto.ChatbotResponse;
import com.evmarketplace.model.Vehicle;
import com.evmarketplace.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

// Hybrid chatbot: combines rule-based intent matching (keyword detection)
// with catalog-grounded responses (real queries against VehicleRepository)
// rather than either pure canned text or a full external LLM integration.
// This keeps the feature self-contained, free to run, and directly
// verifiable against the actual database during the demo.
@Service
public class ChatbotService {

    @Autowired
    private VehicleRepository vehicleRepository;

    // Matches phrases like "under $50000", "below 40000", "less than 30,000"
    private static final Pattern PRICE_CEILING_PATTERN =
            Pattern.compile("(?:under|below|less than)\\s*\\$?([0-9,]+)");

    public ChatbotResponse respond(String rawMessage) {
        if (rawMessage == null || rawMessage.isBlank()) {
            return new ChatbotResponse(
                    "I didn't catch that, could you type your question again?",
                    "empty",
                    null);
        }

        String message = rawMessage.toLowerCase().trim();

        if (matchesAny(message, "hi", "hello", "hey")) {
            return new ChatbotResponse(
                    "Hi! I can help you find a vehicle, check hot deals, book a test drive, "
                            + "estimate a loan payment, or answer checkout questions. What do you need?",
                    "greeting",
                    null);
        }

        if (matchesAny(message, "hot deal", "hot deals", "discount", "on sale")) {
            return handleHotDeals();
        }

        // Catalog-grounded vehicle search: triggers if the message names a
        // known make (queried live from the DB, not hardcoded) or uses
        // common search phrasing.
        String detectedMake = detectKnownMake(message);
        boolean looksLikeSearch = matchesAny(message,
                "show me", "looking for", "find", "available", "do you have");

        if (detectedMake != null || looksLikeSearch) {
            return handleVehicleSearch(message, detectedMake);
        }

        if (matchesAny(message, "test drive", "schedule a drive", "book a drive")) {
            return new ChatbotResponse(
                    "You can book a test drive from any vehicle's detail page, look for the "
                            + "\"Book a Test Drive\" button, pick an available time slot, and confirm.",
                    "test-drive-help",
                    null);
        }

        if (matchesAny(message, "loan", "financing", "monthly payment", "calculator")) {
            return new ChatbotResponse(
                    "You can estimate your monthly payment using our loan calculator on a "
                            + "vehicle's detail page. Just enter the vehicle price, your down payment, "
                            + "the interest rate, and the loan duration.",
                    "loan-help",
                    null);
        }

        if (matchesAny(message, "checkout", "cart", "buy", "purchase", "order")) {
            return new ChatbotResponse(
                    "Add a vehicle to your cart from its detail page, then go to your cart to "
                            + "review your order and check out. You'll need to be signed in to complete checkout.",
                    "checkout-help",
                    null);
        }

        if (matchesAny(message, "review", "rating", "rate")) {
            return new ChatbotResponse(
                    "You can leave a review and a star rating from a vehicle's detail page after "
                            + "viewing it, look for the review section below the vehicle details.",
                    "review-help",
                    null);
        }

        if (matchesAny(message, "human", "support", "agent", "contact")) {
            return new ChatbotResponse(
                    "I'm a virtual assistant for browsing and buying vehicles. For anything I "
                            + "can't help with, please reach out to our support email listed in the footer.",
                    "support-fallback",
                    null);
        }

        return new ChatbotResponse(
                "I'm not sure I understood that. I can help with finding vehicles, hot deals, "
                        + "test drives, loan estimates, checkout, or reviews, try rephrasing your question.",
                "fallback",
                null);
    }

    private ChatbotResponse handleHotDeals() {
        List<Vehicle> deals = vehicleRepository.findAll().stream()
                .filter(v -> v.getDiscount() != null
                        && v.getDiscount().compareTo(BigDecimal.ZERO) > 0)
                .collect(Collectors.toList());

        if (deals.isEmpty()) {
            return new ChatbotResponse(
                    "There aren't any hot deals right now, check back soon!",
                    "hot-deals",
                    Collections.emptyList());
        }

        String names = deals.stream()
                .limit(3)
                .map(v -> v.getMake() + " " + v.getModel())
                .collect(Collectors.joining(", "));

        return new ChatbotResponse(
                "Here are our current hot deals: " + names
                        + (deals.size() > 3 ? ", and more." : "."),
                "hot-deals",
                deals);
    }

    private ChatbotResponse handleVehicleSearch(String message, String detectedMake) {
        List<Vehicle> results = vehicleRepository.findAll();

        if (detectedMake != null) {
            results = results.stream()
                    .filter(v -> v.getMake().equalsIgnoreCase(detectedMake))
                    .collect(Collectors.toList());
        }

        Matcher priceMatcher = PRICE_CEILING_PATTERN.matcher(message);
        if (priceMatcher.find()) {
            try {
                BigDecimal ceiling = new BigDecimal(priceMatcher.group(1).replace(",", ""));
                results = results.stream()
                        .filter(v -> v.getPrice().compareTo(ceiling) <= 0)
                        .collect(Collectors.toList());
            } catch (NumberFormatException ignored) {
                // If parsing fails, skip the price filter rather than error out
            }
        }

        if (results.isEmpty()) {
            return new ChatbotResponse(
                    "I couldn't find any vehicles matching that, try browsing the full "
                            + "catalogue or adjusting your filters.",
                    "vehicle-search",
                    Collections.emptyList());
        }

        String names = results.stream()
                .limit(3)
                .map(v -> v.getYear() + " " + v.getMake() + " " + v.getModel()
                        + " ($" + v.getPrice() + ")")
                .collect(Collectors.joining(", "));

        return new ChatbotResponse(
                "I found " + results.size() + " matching vehicle(s): " + names
                        + (results.size() > 3 ? ", and more." : "."),
                "vehicle-search",
                results);
    }

    // Checks the live catalog for a make name mentioned in the message,
    // rather than hardcoding a make list that could drift from the seeded data.
    @SuppressWarnings("null")
    private String detectKnownMake(String message) {
        return vehicleRepository.findAll().stream()
                .map(Vehicle::getMake)
                .distinct()
                .filter(make -> message.contains(make.toLowerCase()))
                .findFirst()
                .orElse(null);
    }

    private boolean matchesAny(String message, String... keywords) {
        for (String keyword : keywords) {
            if (message.contains(keyword)) {
                return true;
            }
        }
        return false;
    }
}