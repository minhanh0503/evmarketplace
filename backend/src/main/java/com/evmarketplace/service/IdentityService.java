package com.evmarketplace.service;

import com.evmarketplace.dto.LoginRequest;
import com.evmarketplace.dto.RegisterRequest;
import com.evmarketplace.model.User;
import com.evmarketplace.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class IdentityService {

    private final UserRepository userRepository;

    // Simple in-memory session store for Deliverable 2.
    private final Map<String, Long> activeSessions = new ConcurrentHashMap<>();

    public IdentityService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Map<String, Object> registerUser(RegisterRequest request) {
        validateRegistrationRequest(request);

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalStateException("An account with this email already exists.");
        }

        User user = new User(
                request.getFirstName().trim(),
                request.getLastName().trim(),
                normalizedEmail,
                request.getPassword(),
                "CUSTOMER"
        );

        User savedUser = userRepository.save(user);

        return Map.of(
                "success", true,
                "message", "User registered successfully.",
                "userId", savedUser.getId(),
                "email", savedUser.getEmail(),
                "role", savedUser.getRole()
        );
    }

    public Map<String, Object> loginUser(LoginRequest request) {
        validateLoginRequest(request);

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        String token = UUID.randomUUID().toString();
        activeSessions.put(token, user.getId());

        return Map.of(
                "success", true,
                "message", "Login successful.",
                "token", token,
                "userId", user.getId(),
                "email", user.getEmail(),
                "role", user.getRole()
        );
    }

    public Map<String, Object> logoutUser(String token) {
        if (token == null || token.isBlank() || !activeSessions.containsKey(token)) {
            throw new IllegalArgumentException("Invalid or missing session token.");
        }

        activeSessions.remove(token);

        return Map.of(
                "success", true,
                "message", "Logout successful."
        );
    }

    public Map<String, Object> validateUser(String token) {
        boolean valid = token != null && activeSessions.containsKey(token);

        return Map.of(
                "valid", valid,
                "message", valid ? "Session is valid." : "Session is invalid."
        );
    }

    private void validateRegistrationRequest(RegisterRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Registration request cannot be empty.");
        }

        if (isBlank(request.getFirstName()) ||
                isBlank(request.getLastName()) ||
                isBlank(request.getEmail()) ||
                isBlank(request.getPassword())) {
            throw new IllegalArgumentException("All registration fields are required.");
        }
    }

    private void validateLoginRequest(LoginRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Login request cannot be empty.");
        }

        if (isBlank(request.getEmail()) || isBlank(request.getPassword())) {
            throw new IllegalArgumentException("Email and password are required.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
