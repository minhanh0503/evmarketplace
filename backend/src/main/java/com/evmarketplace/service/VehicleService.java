package com.evmarketplace.service;

import com.evmarketplace.model.Vehicle;
import com.evmarketplace.repository.VehicleRepository;
import com.evmarketplace.dto.VehicleSearchRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;


    // GET all vehicles
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }


    // CREATE vehicle
    public Vehicle addVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }


    // GET vehicle by ID
    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> 
                    new RuntimeException("Vehicle not found with id: " + id)
                );
    }


    // DELETE vehicle
    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }


    // SEARCH vehicles
    public List<Vehicle> searchVehicles(VehicleSearchRequest req) {

        List<Vehicle> vehicles = vehicleRepository.findAll();

        // keyword search (make OR model)
        if (req.getKeyword() != null && !req.getKeyword().isEmpty()) {
            String keyword = req.getKeyword().toLowerCase();

            vehicles = vehicles.stream()
                    .filter(v ->
                            v.getMake().toLowerCase().contains(keyword) ||
                            v.getModel().toLowerCase().contains(keyword)
                    )
                    .collect(Collectors.toList());
        }


        // make filter
        if (req.getMake() != null && !req.getMake().isEmpty()) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getMake()
                            .equalsIgnoreCase(req.getMake()))
                    .collect(Collectors.toList());
        }


        // condition filter
        if (req.getCondition() != null && !req.getCondition().isEmpty()) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getCondition()
                            .equalsIgnoreCase(req.getCondition()))
                    .collect(Collectors.toList());
        }


        // year filter
        if (req.getYear() != null) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getYear() >= req.getYear())
                    .collect(Collectors.toList());
        }


        // price filter
        if (req.getMaxPrice() != null) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getPrice()
                            .compareTo(req.getMaxPrice()) <= 0)
                    .collect(Collectors.toList());
        }


        // mileage filter
        if (req.getMileage() != null) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getMileage() <= req.getMileage())
                    .collect(Collectors.toList());
        }


        // sorting
        if (req.getSort() != null) {

            switch (req.getSort()) {

                case "priceAsc":
                    vehicles = vehicles.stream()
                            .sorted((a, b) -> 
                                a.getPrice().compareTo(b.getPrice()))
                            .collect(Collectors.toList());
                    break;


                case "priceDesc":
                    vehicles = vehicles.stream()
                            .sorted((a, b) -> 
                                b.getPrice().compareTo(a.getPrice()))
                            .collect(Collectors.toList());
                    break;


                case "yearDesc":
                    vehicles = vehicles.stream()
                            .sorted((a, b) -> 
                                b.getYear() - a.getYear())
                            .collect(Collectors.toList());
                    break;
            }
        }

        return vehicles;
    }

    public List<Vehicle> getHotDeals() {
        return vehicleRepository.findByDiscountGreaterThanOrderByDiscountDesc(BigDecimal.ZERO);
    }
}