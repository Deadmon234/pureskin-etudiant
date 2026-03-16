package com.pureskin.etudiant.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import com.pureskin.etudiant.converter.ListConverter;
import com.pureskin.etudiant.converter.MapConverter;

@Entity
@Table(name = "payments")
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "order_id", unique = true, nullable = false)
    private String orderId;
    
    @Column(name = "customer_name", nullable = false)
    private String customerName;
    
    @Column(name = "customer_email", nullable = false)
    private String customerEmail;
    
    @Column(name = "customer_phone")
    private String customerPhone;
    
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "currency")
    private String currency = "XAF";
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    @Column(name = "status", nullable = false)
    private String status; // PENDING, SUCCESS, FAILED, CANCELLED
    
    @Column(name = "payment_reference")
    private String paymentReference;
    
    @Column(name = "faroty_transaction_id")
    private String farotyTransactionId;
    
    @Column(name = "faroty_wallet_id")
    private String farotyWalletId;
    
    @Column(name = "products", columnDefinition = "TEXT")
    @Convert(converter = ListConverter.class)
    private List<Map<String, Object>> products = new java.util.ArrayList<>();
    
    @Column(name = "shipping_address", columnDefinition = "TEXT")
    @Convert(converter = MapConverter.class)
    private Map<String, Object> shippingAddress = new java.util.HashMap<>();
    
    @Column(name = "billing_address", columnDefinition = "TEXT")
    @Convert(converter = MapConverter.class)
    private Map<String, Object> billingAddress = new java.util.HashMap<>();
    
    @Column(name = "metadata", columnDefinition = "TEXT")
    @Convert(converter = MapConverter.class)
    private Map<String, Object> metadata = new java.util.HashMap<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }
    
    public String getFarotyTransactionId() { return farotyTransactionId; }
    public void setFarotyTransactionId(String farotyTransactionId) { this.farotyTransactionId = farotyTransactionId; }
    
    public String getFarotyWalletId() { return farotyWalletId; }
    public void setFarotyWalletId(String farotyWalletId) { this.farotyWalletId = farotyWalletId; }
    
    public List<Map<String, Object>> getProducts() { return products; }
    public void setProducts(List<Map<String, Object>> products) { this.products = products; }
    
    public Map<String, Object> getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(Map<String, Object> shippingAddress) { this.shippingAddress = shippingAddress; }
    
    public Map<String, Object> getBillingAddress() { return billingAddress; }
    public void setBillingAddress(Map<String, Object> billingAddress) { this.billingAddress = billingAddress; }
    
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
    
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    
    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
    }
    
    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
