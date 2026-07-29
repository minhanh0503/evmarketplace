package com.evmarketplace.dto;

// Request body for POST /api/chatbot/query
public class ChatbotRequest {

    private String message;

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}