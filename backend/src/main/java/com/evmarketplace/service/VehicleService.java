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

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle addVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Vehicle not found with id: " + id)
                );
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }

    public List<Vehicle> searchVehicles(VehicleSearchRequest req) {

        List<Vehicle> vehicles = vehicleRepository.findAll();

        if (req.getKeyword() != null && !req.getKeyword().isEmpty()) {
            String keyword = req.getKeyword().toLowerCase();
            vehicles = vehicles.stream()
                    .filter(v ->
                            v.getMake().toLowerCase().contains(keyword) ||
                            v.getModel().toLowerCase().contains(keyword)
                    )
                    .collect(Collectors.toList());
        }

        if (req.getMake() != null && !req.getMake().isEmpty()) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getMake().equalsIgnoreCase(req.getMake()))
                    .collect(Collectors.toList());
        }

        if (req.getCondition() != null && !req.getCondition().isEmpty()) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getCondition().equalsIgnoreCase(req.getCondition()))
                    .collect(Collectors.toList());
        }

        if (req.getYear() != null) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getYear() >= req.getYear())
                    .collect(Collectors.toList());
        }

        if (req.getMaxPrice() != null) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getPrice().compareTo(req.getMaxPrice()) <= 0)
                    .collect(Collectors.toList());
        }

        if (req.getMileage() != null) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getMileage() <= req.getMileage())
                    .collect(Collectors.toList());
        }

        // body type / "shape" filter
        if (req.getBodyType() != null && !req.getBodyType().isEmpty()) {
            vehicles = vehicles.stream()
                    .filter(v -> req.getBodyType().equalsIgnoreCase(v.getBodyType()))
                    .collect(Collectors.toList());
        }

        // vehicle history filter
        if (req.getHasAccidentHistory() != null) {
            vehicles = vehicles.stream()
                    .filter(v -> req.getHasAccidentHistory().equals(v.getHasAccidentHistory()))
                    .collect(Collectors.toList());
        }

        if (req.getSort() != null) {
            switch (req.getSort()) {
                case "mileageAsc":
                    vehicles = vehicles.stream()
                            .sorted((a, b) -> a.getMileage() - b.getMileage())
                            .collect(Collectors.toList());
                    break;

                case "mileageDesc":
                    vehicles = vehicles.stream()
                            .sorted((a, b) -> b.getMileage() - a.getMileage())
                            .collect(Collectors.toList());
                    break;

                case "priceAsc":
                    vehicles = vehicles.stream()
                            .sorted((a, b) -> a.getPrice().compareTo(b.getPrice()))
                            .collect(Collectors.toList());
                    break;

                case "priceDesc":
                    vehicles = vehicles.stream()
                            .sorted((a, b) -> b.getPrice().compareTo(a.getPrice()))
                            .collect(Collectors.toList());
                    break;

                case "yearDesc":
                    vehicles = vehicles.stream()
                            .sorted((a, b) -> b.getYear() - a.getYear())
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