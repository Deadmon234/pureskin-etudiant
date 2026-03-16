package com.pureskin.etudiant.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "loyalty_programs")
public class LoyaltyProgram {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Program name is required")
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    @NotNull(message = "Points multiplier is required")
    @Column(nullable = false)
    private Double pointsMultiplier;
    
    @NotNull(message = "Discount percentage is required")
    @Column(nullable = false)
    private Double discountPercentage;
    
    private Integer minPoints;
    
    private Integer maxPoints;
    
    @Column(nullable = false)
    private Integer sortOrder = 0;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    private String benefits;
    
    private String nextReward;
    
    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt;
    
    // Constructors
    public LoyaltyProgram() {}
    
    public LoyaltyProgram(String name, Double pointsMultiplier, Double discountPercentage) {
        this.name = name;
        this.pointsMultiplier = pointsMultiplier;
        this.discountPercentage = discountPercentage;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Double getPointsMultiplier() { return pointsMultiplier; }
    public void setPointsMultiplier(Double pointsMultiplier) { this.pointsMultiplier = pointsMultiplier; }
    
    public Double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Double discountPercentage) { this.discountPercentage = discountPercentage; }
    
    public Integer getMinPoints() { return minPoints; }
    public void setMinPoints(Integer minPoints) { this.minPoints = minPoints; }
    
    public Integer getMaxPoints() { return maxPoints; }
    public void setMaxPoints(Integer maxPoints) { this.maxPoints = maxPoints; }
    
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public String getBenefits() { return benefits; }
    public void setBenefits(String benefits) { this.benefits = benefits; }
    
    public String getNextReward() { return nextReward; }
    public void setNextReward(String nextReward) { this.nextReward = nextReward; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
