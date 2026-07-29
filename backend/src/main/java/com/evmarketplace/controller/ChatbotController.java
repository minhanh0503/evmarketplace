package com.evmarketplace.controller;

import com.evmarketplace.dto.ChatbotRequest;
import com.evmarketplace.dto.ChatbotResponse;
import com.evmarketplace.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    // POST /api/chatbot/query
    // Body: { "message": "show me tesla under 50000" }
    @PostMapping("/query")
    public ResponseEntity<ChatbotResponse> query(@RequestBody ChatbotRequest request) {
        return ResponseEntity.ok(chatbotService.respond(request.getMessage()));
    }
}