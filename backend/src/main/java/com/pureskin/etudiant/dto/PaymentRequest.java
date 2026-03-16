package com.pureskin.etudiant.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class PaymentRequest {
    private String orderId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private BigDecimal amount;
    private String currency;
    private String paymentMethod;
    private String status;
    private String paymentReference;
    private String farotyTransactionId;
    private String farotyWalletId;
    
    // Champs pour les informations produits
    private List<Map<String, Object>> products;

    // Getters and Setters
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
}
