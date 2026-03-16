package com.pureskin.etudiant.service;

import com.pureskin.etudiant.model.Payment;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class FarotyService {
    
    @Autowired
    private PaymentService paymentService;
    
    @Value("${faroty.api.url}")
    private String farotyApiUrl;
    
    @Value("${faroty.api.key}")
    private String farotyApiKey;
    
    @Value("${faroty.wallet.id}")
    private String farotyWalletId;
    
    @Value("${faroty.withdrawal.refId}")
    private String farotyWithdrawalRefId;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Créer une session de paiement Faroty
    public Map<String, Object> createPaymentSession(Map<String, Object> paymentData) {
        try {
            String url = farotyApiUrl + "/payments/api/v1/payment-sessions";
            
            // Préparer les données pour Faroty
            Map<String, Object> farotyRequest = new HashMap<>();
            farotyRequest.put("walletId", farotyWalletId);
            farotyRequest.put("currencyCode", "XAF");
            farotyRequest.put("cancelUrl", paymentData.get("cancelUrl"));
            farotyRequest.put("successUrl", paymentData.get("successUrl"));
            farotyRequest.put("type", "DEPOSIT");
            farotyRequest.put("amount", paymentData.get("amount"));
            farotyRequest.put("contentType", "CAMPAIGN_SIMPLE");
            
            // Contenu dynamique
            Map<String, Object> dynamicContent = new HashMap<>();
            dynamicContent.put("title", paymentData.get("title"));
            dynamicContent.put("description", paymentData.get("description"));
            dynamicContent.put("target", paymentData.get("target"));
            dynamicContent.put("imageUrl", "https://media.faroty.me/api/media/public/c3e256db-6c97-48a7-8e8d-f2ba1d568727.jpg");
            farotyRequest.put("dynamicContentData", dynamicContent);
            
            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-API-KEY", farotyApiKey);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(farotyRequest, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                System.out.println("✅ Faroty session created: " + responseBody);
                return responseBody;
            } else {
                System.err.println("❌ Error creating Faroty session: " + response.getStatusCode());
                return Map.of("success", false, "error", "Failed to create session");
            }
            
        } catch (Exception e) {
            System.err.println("❌ Exception creating Faroty session: " + e.getMessage());
            e.printStackTrace();
            return Map.of("success", false, "error", e.getMessage());
        }
    }
    
    // Créer une session de retrait Faroty
    public Map<String, Object> createWithdrawalSession(Double amount, String authToken) {
        try {
            String url = farotyApiUrl + "/payments/api/v1/payment-sessions";
            
            // Préparer les données pour Faroty
            Map<String, Object> farotyRequest = new HashMap<>();
            farotyRequest.put("walletId", farotyWalletId);
            farotyRequest.put("currencyCode", "XAF");
            farotyRequest.put("type", "WITHDRAWAL");
            farotyRequest.put("amount", amount);
            farotyRequest.put("refId", farotyWithdrawalRefId);
            
            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-API-KEY", farotyApiKey);
            headers.set("Authorization", "Bearer " + authToken);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(farotyRequest, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                System.out.println("✅ Faroty withdrawal session created: " + responseBody);
                return responseBody;
            } else {
                System.err.println("❌ Error creating Faroty withdrawal session: " + response.getStatusCode());
                return Map.of("success", false, "error", "Failed to create withdrawal session");
            }
            
        } catch (Exception e) {
            System.err.println("❌ Exception creating Faroty withdrawal session: " + e.getMessage());
            e.printStackTrace();
            return Map.of("success", false, "error", e.getMessage());
        }
    }
    
    // Vérifier le statut d'une session
    public Map<String, Object> checkSessionStatus(String sessionToken) {
        try {
            String url = farotyApiUrl + "/payments/api/v1/payment-sessions/" + sessionToken + "/status";
            
            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-API-KEY", farotyApiKey);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                System.out.println("✅ Faroty session status checked: " + responseBody);
                return responseBody;
            } else {
                System.err.println("❌ Error checking Faroty session status: " + response.getStatusCode());
                return Map.of("success", false, "error", "Failed to check session status");
            }
            
        } catch (Exception e) {
            System.err.println("❌ Exception checking Faroty session status: " + e.getMessage());
            e.printStackTrace();
            return Map.of("success", false, "error", e.getMessage());
        }
    }
    
    // Initier l'authentification OTP
    public Map<String, Object> initiateOtpAuth(String phoneNumber) {
        try {
            String url = farotyApiUrl + "/payments/api/v1/auth/otp/send";
            
            Map<String, Object> request = new HashMap<>();
            request.put("phoneNumber", phoneNumber);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-API-KEY", farotyApiKey);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                System.out.println("✅ OTP auth initiated for: " + phoneNumber);
                return responseBody;
            } else {
                System.err.println("❌ Error initiating OTP auth: " + response.getStatusCode());
                return Map.of("success", false, "error", "Failed to initiate OTP auth");
            }
            
        } catch (Exception e) {
            System.err.println("❌ Exception initiating OTP auth: " + e.getMessage());
            e.printStackTrace();
            return Map.of("success", false, "error", e.getMessage());
        }
    }
    
    // Valider l'OTP
    public Map<String, Object> validateOtp(String phoneNumber, String otp) {
        try {
            String url = farotyApiUrl + "/payments/api/v1/auth/otp/validate";
            
            Map<String, Object> request = new HashMap<>();
            request.put("phoneNumber", phoneNumber);
            request.put("otp", otp);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-API-KEY", farotyApiKey);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                System.out.println("✅ OTP validated for: " + phoneNumber);
                return responseBody;
            } else {
                System.err.println("❌ Error validating OTP: " + response.getStatusCode());
                return Map.of("success", false, "error", "Failed to validate OTP");
            }
            
        } catch (Exception e) {
            System.err.println("❌ Exception validating OTP: " + e.getMessage());
            e.printStackTrace();
            return Map.of("success", false, "error", e.getMessage());
        }
    }
    
    // Traiter le webhook de Faroty
    public void processWebhook(Map<String, Object> webhookData) {
        try {
            System.out.println("🔔 Processing Faroty webhook: " + webhookData);
            
            String orderId = extractOrderId(webhookData);
            if (orderId == null) {
                System.err.println("❌ No orderId found in webhook");
                return;
            }
            
            Optional<Payment> paymentOpt = paymentService.getPaymentByOrderId(orderId);
            if (paymentOpt.isPresent()) {
                Payment payment = paymentOpt.get();
                
                // Extraire et mettre à jour les informations
                String status = extractStatus(webhookData);
                String transactionId = extractTransactionId(webhookData);
                String reference = extractReference(webhookData);
                
                if (transactionId != null) {
                    payment.setFarotyTransactionId(transactionId);
                }
                if (reference != null) {
                    payment.setPaymentReference(reference);
                }
                
                // Mettre à jour le statut
                payment.setStatus(mapFarotyStatus(status));
                
                // Marquer comme traité si nécessaire
                if ("SUCCESS".equals(payment.getStatus()) || "FAILED".equals(payment.getStatus())) {
                    payment.setProcessedAt(LocalDateTime.now());
                }
                
                paymentService.createPayment(payment); // Sauvegarder
                System.out.println("✅ Payment updated via webhook: " + orderId + " -> " + payment.getStatus());
            } else {
                System.err.println("❌ Payment not found for orderId: " + orderId);
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error processing webhook: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // Méthodes utilitaires pour extraire les données du webhook
    private String extractOrderId(Map<String, Object> data) {
        // Essayer différentes clés possibles
        String[] possibleKeys = {"orderId", "order_id", "merchantOrderId", "merchant_order_id"};
        
        for (String key : possibleKeys) {
            if (data.containsKey(key)) {
                return (String) data.get(key);
            }
        }
        
        // Vérifier dans la section "data" si elle existe
        if (data.containsKey("data")) {
            Map<String, Object> dataSection = (Map<String, Object>) data.get("data");
            for (String key : possibleKeys) {
                if (dataSection.containsKey(key)) {
                    return (String) dataSection.get(key);
                }
            }
        }
        
        return null;
    }
    
    private String extractStatus(Map<String, Object> data) {
        String[] possibleKeys = {"status", "paymentStatus", "transaction_status"};
        
        for (String key : possibleKeys) {
            if (data.containsKey(key)) {
                return (String) data.get(key);
            }
        }
        
        return "PENDING";
    }
    
    private String extractTransactionId(Map<String, Object> data) {
        String[] possibleKeys = {"transactionId", "transaction_id", "farotyTransactionId"};
        
        for (String key : possibleKeys) {
            if (data.containsKey(key)) {
                return (String) data.get(key);
            }
        }
        
        return null;
    }
    
    private String extractReference(Map<String, Object> data) {
        String[] possibleKeys = {"reference", "paymentReference", "ref"};
        
        for (String key : possibleKeys) {
            if (data.containsKey(key)) {
                return (String) data.get(key);
            }
        }
        
        return null;
    }
    
    private String mapFarotyStatus(String farotyStatus) {
        if (farotyStatus == null) return "PENDING";
        
        switch (farotyStatus.toUpperCase()) {
            case "COMPLETED":
            case "SUCCESS":
                return "SUCCESS";
            case "FAILED":
            case "ERROR":
                return "FAILED";
            case "CANCELLED":
            case "CANCELED":
                return "CANCELLED";
            case "PENDING":
            case "PROCESSING":
            default:
                return "PENDING";
        }
    }
}
