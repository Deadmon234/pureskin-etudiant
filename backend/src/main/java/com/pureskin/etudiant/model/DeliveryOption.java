package com.pureskin.etudiant.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_options")
public class DeliveryOption {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Option name is required")
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    @NotNull(message = "Price is required")
    @Column(nullable = false)
    private Double price;
    
    private Integer deliveryTimeMin;
    
    private Integer deliveryTimeMax;
    
    private String deliveryTimeUnit;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    private Boolean isDefault = false;
    
    private Boolean isExpress = false;
    
    private String trackingAvailable;
    
    private String restrictions;
    
    private Integer sortOrder = 0;
    
    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt;
    
    // Constructors
    public DeliveryOption() {}
    
    public DeliveryOption(String name, Double price) {
        this.name = name;
        this.price = price;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    
    public Integer getDeliveryTimeMin() { return deliveryTimeMin; }
    public void setDeliveryTimeMin(Integer deliveryTimeMin) { this.deliveryTimeMin = deliveryTimeMin; }
    
    public Integer getDeliveryTimeMax() { return deliveryTimeMax; }
    public void setDeliveryTimeMax(Integer deliveryTimeMax) { this.deliveryTimeMax = deliveryTimeMax; }
    
    public String getDeliveryTimeUnit() { return deliveryTimeUnit; }
    public void setDeliveryTimeUnit(String deliveryTimeUnit) { this.deliveryTimeUnit = deliveryTimeUnit; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public Boolean getIsDefault() { return isDefault; }
    public void setIsDefault(Boolean isDefault) { this.isDefault = isDefault; }
    
    public Boolean getIsExpress() { return isExpress; }
    public void setIsExpress(Boolean isExpress) { this.isExpress = isExpress; }
    
    public String getTrackingAvailable() { return trackingAvailable; }
    public void setTrackingAvailable(String trackingAvailable) { this.trackingAvailable = trackingAvailable; }
    
    public String getRestrictions() { return restrictions; }
    public void setRestrictions(String restrictions) { this.restrictions = restrictions; }
    
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
