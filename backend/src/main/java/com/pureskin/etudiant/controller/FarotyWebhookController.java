package com.pureskin.etudiant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pureskin.etudiant.model.Order;
import com.pureskin.etudiant.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/webhooks/faroty")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class FarotyWebhookController {
    
    @Autowired
    private OrderService orderService;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Secret du webhook Faroty
    private static final String WEBHOOK_SECRET = "whs_mGj5QgRlqgrFL8puchO-ZMk7QrXNbT1TYSxYAg";
    private static final String WEBHOOK_ID = "d4c411c0-fc50-4d56-a3a5-21c47a26cc66";
    
    /**
     * Endpoint pour recevoir les webhooks de Faroty
     */
    @PostMapping("/payment")
    public ResponseEntity<Map<String, Object>> handlePaymentWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Faroty-Signature") String signature,
            @RequestHeader("X-Faroty-Webhook-ID") String webhookId) {
        
        try {
            System.out.println("=== WEBHOOK FAROTY REÇU ===");
            System.out.println("Webhook ID: " + webhookId);
            System.out.println("Signature: " + signature);
            System.out.println("Payload: " + payload);
            
            // 1. Vérifier l'authenticité du webhook
            if (!verifyWebhookSignature(payload, signature)) {
                System.out.println("❌ Signature invalide - Webhook rejeté");
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Signature invalide"
                ));
            }
            
            System.out.println("✅ Signature webhook validée");
            
            // 2. Parser le payload
            Map<String, Object> webhookData = objectMapper.readValue(payload, Map.class);
            
            // 3. Traiter le webhook selon le type d'événement
            String eventType = (String) webhookData.get("eventType");
            System.out.println("Type d'événement: " + eventType);
            
            Map<String, Object> response = switch (eventType) {
                case "payment.completed" -> handlePaymentCompleted(webhookData);
                case "payment.failed" -> handlePaymentFailed(webhookData);
                case "payment.cancelled" -> handlePaymentCancelled(webhookData);
                case "payment.pending" -> handlePaymentPending(webhookData);
                default -> handleUnknownEvent(webhookData, eventType);
            };
            
            System.out.println("=== WEBHOOK TRAITÉ AVEC SUCCÈS ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("❌ Erreur traitement webhook: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Erreur interne: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Vérifie la signature du webhook Faroty
     */
    private boolean verifyWebhookSignature(String payload, String signature) {
        try {
            System.out.println("Vérification signature...");
            System.out.println("Payload: " + payload);
            System.out.println("Signature reçue: " + signature);
            System.out.println("Secret utilisé: " + WEBHOOK_SECRET);
            
            // La signature Faroty est au format: sha256=hash
            String[] signatureParts = signature.split("=");
            if (signatureParts.length != 2 || !"sha256".equals(signatureParts[0])) {
                System.out.println("❌ Format de signature invalide");
                return false;
            }
            
            String receivedHash = signatureParts[1];
            System.out.println("Hash reçu: " + receivedHash);
            
            // Calculer le hash HMAC-SHA256
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(WEBHOOK_SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secretKey);
            
            byte[] computedHashBytes = sha256_HMAC.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String computedHash = Base64.getEncoder().encodeToString(computedHashBytes);
            
            System.out.println("Hash calculé: " + computedHash);
            
            // Comparer les hashes
            boolean isValid = computedHash.equals(receivedHash);
            System.out.println("Signature valide: " + isValid);
            
            return isValid;
            
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            System.out.println("❌ Erreur lors de la vérification de signature: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Traite un paiement complété avec succès
     */
    private Map<String, Object> handlePaymentCompleted(Map<String, Object> webhookData) {
        System.out.println("🎉 PAIEMENT COMPLÉTÉ - Traitement en cours...");
        
        try {
            Map<String, Object> paymentData = (Map<String, Object>) webhookData.get("data");
            Map<String, Object> payment = (Map<String, Object>) paymentData.get("payment");
            Map<String, Object> session = (Map<String, Object>) paymentData.get("session");
            
            String sessionToken = (String) session.get("sessionToken");
            String walletId = (String) payment.get("walletId");
            String status = (String) payment.get("status");
            Double amount = ((Number) payment.get("amount")).doubleValue();
            String currency = (String) payment.get("currency");
            
            System.out.println("Session Token: " + sessionToken);
            System.out.println("Wallet ID: " + walletId);
            System.out.println("Status: " + status);
            System.out.println("Amount: " + amount + " " + currency);
            
            // Mettre à jour la commande correspondante
            Order updatedOrder = orderService.updateOrderStatusBySessionToken(
                sessionToken, 
                "COMPLETED", 
                "COMPLETED",
                walletId,
                amount,
                currency
            );
            
            if (updatedOrder != null) {
                System.out.println("✅ Commande mise à jour: " + updatedOrder.getOrderNumber());
                
                return Map.of(
                    "success", true,
                    "message", "Paiement complété traité avec succès",
                    "orderNumber", updatedOrder.getOrderNumber(),
                    "status", updatedOrder.getStatus(),
                    "paymentStatus", updatedOrder.getPaymentStatus()
                );
            } else {
                System.out.println("❌ Aucune commande trouvée pour ce sessionToken");
                return Map.of(
                    "success", false,
                    "message", "Aucune commande trouvée pour ce paiement"
                );
            }
            
        } catch (Exception e) {
            System.out.println("❌ Erreur traitement paiement complété: " + e.getMessage());
            return Map.of(
                "success", false,
                "message", "Erreur lors du traitement du paiement complété: " + e.getMessage()
            );
        }
    }
    
    /**
     * Traite un paiement échoué
     */
    private Map<String, Object> handlePaymentFailed(Map<String, Object> webhookData) {
        System.out.println("❌ PAIEMENT ÉCHOUÉ - Traitement en cours...");
        
        try {
            Map<String, Object> paymentData = (Map<String, Object>) webhookData.get("data");
            Map<String, Object> payment = (Map<String, Object>) paymentData.get("payment");
            Map<String, Object> session = (Map<String, Object>) paymentData.get("session");
            
            String sessionToken = (String) session.get("sessionToken");
            String walletId = (String) payment.get("walletId");
            String status = (String) payment.get("status");
            
            System.out.println("Session Token: " + sessionToken);
            System.out.println("Wallet ID: " + walletId);
            System.out.println("Status: " + status);
            
            // Mettre à jour la commande
            Order updatedOrder = orderService.updateOrderStatusBySessionToken(
                sessionToken, 
                "FAILED", 
                "FAILED",
                walletId,
                null,
                null
            );
            
            if (updatedOrder != null) {
                System.out.println("✅ Commande mise à jour (échec): " + updatedOrder.getOrderNumber());
                
                return Map.of(
                    "success", true,
                    "message", "Paiement échoué traité",
                    "orderNumber", updatedOrder.getOrderNumber(),
                    "status", updatedOrder.getStatus()
                );
            } else {
                return Map.of(
                    "success", false,
                    "message", "Aucune commande trouvée pour ce paiement échoué"
                );
            }
            
        } catch (Exception e) {
            System.out.println("❌ Erreur traitement paiement échoué: " + e.getMessage());
            return Map.of(
                "success", false,
                "message", "Erreur lors du traitement du paiement échoué: " + e.getMessage()
            );
        }
    }
    
    /**
     * Traite un paiement annulé
     */
    private Map<String, Object> handlePaymentCancelled(Map<String, Object> webhookData) {
        System.out.println("🚫 PAIEMENT ANNULÉ - Traitement en cours...");
        
        try {
            Map<String, Object> paymentData = (Map<String, Object>) webhookData.get("data");
            Map<String, Object> payment = (Map<String, Object>) paymentData.get("payment");
            Map<String, Object> session = (Map<String, Object>) paymentData.get("session");
            
            String sessionToken = (String) session.get("sessionToken");
            
            // Mettre à jour la commande
            Order updatedOrder = orderService.updateOrderStatusBySessionToken(
                sessionToken, 
                "CANCELLED", 
                "CANCELLED",
                null,
                null,
                null
            );
            
            if (updatedOrder != null) {
                return Map.of(
                    "success", true,
                    "message", "Paiement annulé traité",
                    "orderNumber", updatedOrder.getOrderNumber()
                );
            } else {
                return Map.of(
                    "success", false,
                    "message", "Aucune commande trouvée pour ce paiement annulé"
                );
            }
            
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "message", "Erreur lors du traitement du paiement annulé: " + e.getMessage()
            );
        }
    }
    
    /**
     * Traite un paiement en attente
     */
    private Map<String, Object> handlePaymentPending(Map<String, Object> webhookData) {
        System.out.println("⏳ PAIEMENT EN ATTENTE - Traitement en cours...");
        
        try {
            Map<String, Object> paymentData = (Map<String, Object>) webhookData.get("data");
            Map<String, Object> session = (Map<String, Object>) paymentData.get("session");
            
            String sessionToken = (String) session.get("sessionToken");
            
            // Mettre à jour la commande
            Order updatedOrder = orderService.updateOrderStatusBySessionToken(
                sessionToken, 
                "PENDING", 
                "PENDING",
                null,
                null,
                null
            );
            
            if (updatedOrder != null) {
                return Map.of(
                    "success", true,
                    "message", "Paiement en attente traité",
                    "orderNumber", updatedOrder.getOrderNumber()
                );
            } else {
                return Map.of(
                    "success", false,
                    "message", "Aucune commande trouvée pour ce paiement en attente"
                );
            }
            
        } catch (Exception e) {
            return Map.of(
                "success", false,
                "message", "Erreur lors du traitement du paiement en attente: " + e.getMessage()
            );
        }
    }
    
    /**
     * Traite un événement inconnu
     */
    private Map<String, Object> handleUnknownEvent(Map<String, Object> webhookData, String eventType) {
        System.out.println("❓ ÉVÉNEMENT INCONNU: " + eventType);
        
        return Map.of(
            "success", true,
            "message", "Événement non traité: " + eventType,
            "eventType", eventType
        );
    }
    
    /**
     * Endpoint de test pour vérifier que le webhook est accessible
     */
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testWebhook() {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Webhook Faroty accessible",
            "webhookId", WEBHOOK_ID,
            "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }
}
