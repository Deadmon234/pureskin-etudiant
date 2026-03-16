package com.pureskin.etudiant.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;
    
    @Column(name = "customer_id")
    private Long customerId;
    
    @Column(name = "customer_name")
    private String customerName;
    
    @Column(name = "customer_email")
    private String customerEmail;
    
    @Column(name = "status", nullable = false)
    private String status;
    
    @Column(name = "payment_status", nullable = false)
    private String paymentStatus;
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    @Column(name = "shipping_cost", precision = 10, scale = 2)
    private BigDecimal shippingCost = BigDecimal.ZERO;
    
    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;
    
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(name = "currency", nullable = false)
    private String currency = "XAF";
    
    @Column(name = "shipping_address")
    private String shippingAddress;
    
    @Column(name = "billing_address")
    private String billingAddress;
    
    @Column(name = "tracking_number")
    private String trackingNumber;
    
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "paid_at")
    private LocalDateTime paidAt;
    
    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;
    
    // Champs Faroty
    @Column(name = "wallet_id")
    private String walletId;
    
    @Column(name = "session_token")
    private String sessionToken;
    
    @Column(name = "faroty_user_id")
    private String farotyUserId;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;
    
    // Relation avec les items de commande
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<OrderItem> orderItems = new java.util.ArrayList<>();
    
    // Constructors
    public Order() {
        this.createdAt = LocalDateTime.now();
        this.status = "pending";
        this.paymentStatus = "pending";
    }
    
    public Order(Long customerId, BigDecimal totalAmount) {
        this();
        this.customerId = customerId;
        this.totalAmount = totalAmount;
        this.orderNumber = generateOrderNumber();
    }
    
    // Methods
    private String generateOrderNumber() {
        return "PS" + System.currentTimeMillis();
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    public void markAsPaid() {
        this.paymentStatus = "paid";
        this.updatedAt = LocalDateTime.now();
    }
    
    public void markAsConfirmed() {
        this.status = "processing";
        this.updatedAt = LocalDateTime.now();
    }
    
    public void markAsProcessing() {
        this.status = "processing";
        this.updatedAt = LocalDateTime.now();
    }
    
    public void markAsShipped(String trackingNumber) {
        this.status = "shipped";
        this.trackingNumber = trackingNumber;
        this.shippedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public void markAsDelivered() {
        this.status = "delivered";
        this.deliveredAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public void markAsCancelled() {
        this.status = "cancelled";
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getOrderNumber() {
        return orderNumber;
    }
    
    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }
    
    public Long getCustomerId() {
        return customerId;
    }
    
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
    
    public String getCustomerName() {
        return customerName;
    }
    
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    
    public String getCustomerEmail() {
        return customerEmail;
    }
    
    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getPaymentStatus() {
        return paymentStatus;
    }
    
    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
    
    public BigDecimal getShippingCost() {
        return shippingCost;
    }
    
    public void setShippingCost(BigDecimal shippingCost) {
        this.shippingCost = shippingCost;
    }
    
    public BigDecimal getTaxAmount() {
        return taxAmount;
    }
    
    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public String getShippingAddress() {
        return shippingAddress;
    }
    
    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }
    
    public String getBillingAddress() {
        return billingAddress;
    }
    
    public void setBillingAddress(String billingAddress) {
        this.billingAddress = billingAddress;
    }
    
    public String getTrackingNumber() {
        return trackingNumber;
    }
    
    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    // Getters et setters Faroty
    public String getWalletId() {
        return walletId;
    }
    
    public void setWalletId(String walletId) {
        this.walletId = walletId;
    }
    
    public String getSessionToken() {
        return sessionToken;
    }
    
    public void setSessionToken(String sessionToken) {
        this.sessionToken = sessionToken;
    }
    
    public String getFarotyUserId() {
        return farotyUserId;
    }
    
    public void setFarotyUserId(String farotyUserId) {
        this.farotyUserId = farotyUserId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public java.util.List<OrderItem> getOrderItems() {
        return orderItems;
    }
    
    public void setOrderItems(java.util.List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }
    
    public LocalDateTime getShippedAt() {
        return shippedAt;
    }
    
    public void setShippedAt(LocalDateTime shippedAt) {
        this.shippedAt = shippedAt;
    }
    
    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }
    
    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }
    
    public LocalDateTime getPaidAt() {
        return paidAt;
    }
    
    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }
}
