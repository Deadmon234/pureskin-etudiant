package com.pureskin.etudiant.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "newsletter_subscribers")
public class NewsletterSubscriber {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String university;
    private String studyField;
    private Integer graduationYear;
    private String skinType;
    private String source;
    private Boolean studentVerified;
    private String promoCodeUsed;
    private Boolean guideDownloaded;
    private Boolean weeklyTipsActive;
    private Boolean isActive;
    private LocalDateTime subscriptionDate;
    private LocalDateTime lastEmailSent;
    private Integer emailCount;
    private String unsubscribeReason;
    private LocalDateTime unsubscribeDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructeurs
    public NewsletterSubscriber() {}

    public NewsletterSubscriber(String email, String firstName, String source) {
        this.email = email;
        this.firstName = firstName;
        this.source = source;
        this.studentVerified = false;
        this.promoCodeUsed = "ETUDIANT30";
        this.guideDownloaded = false;
        this.weeklyTipsActive = true;
        this.isActive = true;
        this.subscriptionDate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.emailCount = 0;
    }

    // Getters et Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @Column(unique = true, nullable = false)
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    @Column(name = "first_name")
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    @Column(name = "last_name")
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    @Column(name = "university")
    public String getUniversity() { return university; }
    public void setUniversity(String university) { this.university = university; }

    @Column(name = "study_field")
    public String getStudyField() { return studyField; }
    public void setStudyField(String studyField) { this.studyField = studyField; }

    @Column(name = "graduation_year")
    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

    @Column(name = "skin_type")
    public String getSkinType() { return skinType; }
    public void setSkinType(String skinType) { this.skinType = skinType; }

    @Column
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    @Column(name = "student_verified")
    public Boolean getStudentVerified() { return studentVerified; }
    public void setStudentVerified(Boolean studentVerified) { this.studentVerified = studentVerified; }

    @Column(name = "promo_code_used")
    public String getPromoCodeUsed() { return promoCodeUsed; }
    public void setPromoCodeUsed(String promoCodeUsed) { this.promoCodeUsed = promoCodeUsed; }

    @Column(name = "guide_downloaded")
    public Boolean getGuideDownloaded() { return guideDownloaded; }
    public void setGuideDownloaded(Boolean guideDownloaded) { this.guideDownloaded = guideDownloaded; }

    @Column(name = "weekly_tips_active")
    public Boolean getWeeklyTipsActive() { return weeklyTipsActive; }
    public void setWeeklyTipsActive(Boolean weeklyTipsActive) { this.weeklyTipsActive = weeklyTipsActive; }

    @Column(name = "is_active")
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    @Column(name = "subscription_date")
    public LocalDateTime getSubscriptionDate() { return subscriptionDate; }
    public void setSubscriptionDate(LocalDateTime subscriptionDate) { this.subscriptionDate = subscriptionDate; }

    @Column(name = "last_email_sent")
    public LocalDateTime getLastEmailSent() { return lastEmailSent; }
    public void setLastEmailSent(LocalDateTime lastEmailSent) { this.lastEmailSent = lastEmailSent; }

    @Column(name = "email_count")
    public Integer getEmailCount() { return emailCount; }
    public void setEmailCount(Integer emailCount) { this.emailCount = emailCount; }

    @Column(name = "unsubscribe_reason")
    public String getUnsubscribeReason() { return unsubscribeReason; }
    public void setUnsubscribeReason(String unsubscribeReason) { this.unsubscribeReason = unsubscribeReason; }

    @Column(name = "unsubscribe_date")
    public LocalDateTime getUnsubscribeDate() { return unsubscribeDate; }
    public void setUnsubscribeDate(LocalDateTime unsubscribeDate) { this.unsubscribeDate = unsubscribeDate; }

    @Column(name = "created_at")
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Column(name = "updated_at")
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
