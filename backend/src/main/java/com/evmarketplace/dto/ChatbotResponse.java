package com.evmarketplace.dto;

import com.evmarketplace.model.Vehicle;
import java.util.List;

// Response body for POST /api/chatbot/query.
// "intent" is included so the report/demo can show which rule matched,
// and "vehicles" is populated only for intents that ground their reply
// in real catalog data (search, hot deals).
public class ChatbotResponse {

    private String reply;
    private String intent;
    private List<Vehicle> vehicles;

    public ChatbotResponse(String reply, String intent, List<Vehicle> vehicles) {
        this.reply = reply;
        this.intent = intent;
        this.vehicles = vehicles;
    }

    public String getReply() { return reply; }
    public String getIntent() { return intent; }
    public List<Vehicle> getVehicles() { return vehicles; }
}