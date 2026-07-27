package com.evmarketplace.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password"})
    private User user;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false)
    private Integer quantity;

    // snapshot of price at time of adding, so cart total doesn't
    // silently change if catalogue price changes later
    @Column(nullable = false)
    private BigDecimal unitPrice;

    private LocalDateTime addedAt;

    public CartItem() {
        // default constructor required by JPA
    }

    public CartItem(User user, Vehicle vehicle, Integer quantity, BigDecimal unitPrice) {
        this.user = user;
        this.vehicle = vehicle;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.addedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // convenience accessor so existing code (repositories, DTO mapping) that
    // expects a plain userId keeps working without further changes
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    // convenience accessor, same reasoning as getUserId()
    public Long getVehicleId() {
        return vehicle != null ? vehicle.getId() : null;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }
}