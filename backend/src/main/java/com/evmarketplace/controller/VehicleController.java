package com.evmarketplace.controller;

import com.evmarketplace.model.Vehicle;
import com.evmarketplace.service.VehicleService;
import com.evmarketplace.dto.VehicleSearchRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;
    
    // GET all vehicles
    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    // CREATE vehicle
    @PostMapping
    public Vehicle addVehicle(@RequestBody Vehicle vehicle) {
        return vehicleService.addVehicle(vehicle);
    }

    // GET vehicle by ID
    @GetMapping("/{id}")
    public Vehicle getVehicle(@PathVariable Long id) {
        return vehicleService.getVehicleById(id);
    }

    // DELETE vehicle
    @DeleteMapping("/{id}")
    public void deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
    }

    // SEARCH vehicles
    @GetMapping("/search")
    public List<Vehicle> searchVehicles(@ModelAttribute VehicleSearchRequest req) {
        return vehicleService.searchVehicles(req);
    }

}