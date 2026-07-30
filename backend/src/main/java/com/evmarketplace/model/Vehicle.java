package com.evmarketplace.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import java.util.List;
import java.util.ArrayList;
import jakarta.persistence.FetchType;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String make;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private int year;

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

    // Body type / "shape", e.g. Sedan, SUV, Hatchback, Sports. Nullable so
    // existing rows don't break before being seeded.
    private String bodyType;

    // Whether this vehicle has a reported accident/damage history.
    // Defaults to false so existing rows are treated as clean.
    @Column(nullable = false)
    private Boolean hasAccidentHistory = false;

    // Free-text history report, only meaningful when hasAccidentHistory is true.
    @Column(length = 1000)
    private String accidentHistoryDetails;

    @OneToMany(
        mappedBy = "vehicle",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.EAGER
    )
    private List<VehicleImage> images = new ArrayList<VehicleImage>();

    @OneToMany(
        mappedBy = "vehicle",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.EAGER
    )
    private List<VehicleReview> reviews = new ArrayList<VehicleReview>();

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

    public String getBodyType() {
        return bodyType;
    }

    public void setBodyType(String bodyType) {
        this.bodyType = bodyType;
    }

    public Boolean getHasAccidentHistory() {
        return hasAccidentHistory;
    }

    public void setHasAccidentHistory(Boolean hasAccidentHistory) {
        this.hasAccidentHistory = hasAccidentHistory;
    }

    public String getAccidentHistoryDetails() {
        return accidentHistoryDetails;
    }

    public void setAccidentHistoryDetails(String accidentHistoryDetails) {
        this.accidentHistoryDetails = accidentHistoryDetails;
    }

    public List<VehicleImage> getImages() {
        return images;
    }

    public void setImages(List<VehicleImage> images) {
        this.images = images;
    }

    public List<VehicleReview> getReviews() {
        return reviews;
    }

    public void setReviews(List<VehicleReview> reviews) {
        this.reviews = reviews;
    }

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
                ", bodyType='" + bodyType + '\'' +
                ", hasAccidentHistory=" + hasAccidentHistory +
                '}';
    }
}