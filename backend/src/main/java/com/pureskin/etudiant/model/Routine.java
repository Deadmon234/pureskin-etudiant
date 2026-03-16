package com.pureskin.etudiant.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "routines")
public class Routine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Routine name is required")
    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String image;

    private String skinType;

    @Column(columnDefinition = "TEXT")
    private String skinConcerns;

    @Column(columnDefinition = "TEXT")
    private String steps;

    private Integer durationMinutes;

    private String difficultyLevel;

    @Column(columnDefinition = "TEXT")
    private String productsNeeded;

    @Column(nullable = false)
    private Boolean isRecommended = false;

    private Integer viewCount = 0;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    // Constructors
    public Routine() {}

    public Routine(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getSkinType() { return skinType; }
    public void setSkinType(String skinType) { this.skinType = skinType; }

    public String getSkinConcerns() { return skinConcerns; }
    public void setSkinConcerns(String skinConcerns) { this.skinConcerns = skinConcerns; }

    public String getSteps() { return steps; }
    public void setSteps(String steps) { this.steps = steps; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }

    public String getProductsNeeded() { return productsNeeded; }
    public void setProductsNeeded(String productsNeeded) { this.productsNeeded = productsNeeded; }

    public Boolean getIsRecommended() { return isRecommended; }
    public void setIsRecommended(Boolean isRecommended) { this.isRecommended = isRecommended; }

    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
