package com.evmarketplace.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

    @Entity
    @Table(name = "vehicles")
    public class Vehicle {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        //vehicle make (e.g., Tesla, Nissan, etc.)
        @Column(nullable = false)
        private String make;

        @Column(nullable = false)
        private String model;

        @Column(nullable = false)
        private int year;
        
        //vehicle identification number
        @Column(nullable = false)
        private String vin;

        @Column(nullable = false)
        private BigDecimal price;

        @Column(nullable = false)
        private int mileage;

        @Column(nullable = false)
        private String condition;

        @Column(nullable = false)
        private String color;

        @Column(nullable = false)
        private String imageUrl;

        @Column(nullable = false)
        private BigDecimal discount;
        
        public Vehicle() {
            // default constructor required by JPA
        }

        public Vehicle(String make, String model, int year, String vin, BigDecimal price, int mileage, String condition, String color, String imageUrl, BigDecimal discount) {
            this.make = make;
            this.model = model;
            this.year = year;
            this.vin = vin;
            this.price = price;
            this.mileage = mileage;
            this.condition = condition;
            this.color = color;
            this.imageUrl = imageUrl;
            this.discount = discount;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getMake() {
            return make;
        }

        public void setMake(String make) {
            this.make = make;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public int getYear() {
            return year;
        }

        public void setYear(int year) {
            this.year = year;
        }

        public String getVin() {
            return vin;
        }

        public void setVin(String vin) {
            this.vin = vin;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public int getMileage() {
            return mileage;
        }

        public void setMileage(int mileage) {
            this.mileage = mileage;
        }

        public String getCondition() {
            return condition;
        }

        public void setCondition(String condition) {
            this.condition = condition;
        }
        
        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public BigDecimal getDiscount() {
            return discount;
        }

        public void setDiscount(BigDecimal discount) {
            this.discount = discount;
        }
        
        // Override toString() method for better logging and debugging
        @Override
        public String toString() {
            return "Vehicle{" +
                    "id=" + id +
                    ", make='" + make + '\'' +
                    ", model='" + model + '\'' +
                    ", year=" + year +
                    ", vin='" + vin + '\'' +
                    ", price=" + price +
                    ", mileage=" + mileage +
                    ", condition='" + condition + '\'' +
                    ", color='" + color + '\'' +
                    ", imageUrl='" + imageUrl + '\'' +
                    '}';
        }
    }


