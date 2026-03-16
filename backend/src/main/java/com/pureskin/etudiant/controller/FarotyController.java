package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.dto.PaymentRequest;
import com.pureskin.etudiant.model.Payment;
import com.pureskin.etudiant.service.PaymentService;
import com.pureskin.etudiant.service.FarotyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/faroty")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class FarotyController {
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private FarotyService farotyService;
    
    // Webhook pour recevoir les notifications de Faroty
    @PostMapping("/webhook/payment")
    public ResponseEntity<?> handlePaymentWebhook(@RequestBody Map<String, Object> webhookData) {
        try {
            System.out.println("🔔 Received Faroty webhook: " + webhookData);
            
            // Utiliser le service Faroty pour traiter le webhook
            farotyService.processWebhook(webhookData);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Webhook processed successfully"
            ));
            
        } catch (Exception e) {
            System.err.println("❌ Error processing Faroty webhook: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error processing webhook");
        }
    }
    
    // Créer une session de paiement Faroty
    @PostMapping("/payment/session/create")
    public ResponseEntity<?> createPaymentSession(@RequestBody Map<String, Object> sessionData) {
        try {
            Map<String, Object> result = farotyService.createPaymentSession(sessionData);
            
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error creating payment session: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    // Vérifier le statut d'une session
    @GetMapping("/payment/session/{sessionToken}/status")
    public ResponseEntity<?> checkSessionStatus(@PathVariable String sessionToken) {
        try {
            Map<String, Object> result = farotyService.checkSessionStatus(sessionToken);
            
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error checking session status: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    // Initier l'authentification OTP pour retrait
    @PostMapping("/auth/otp/send")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        try {
            String phoneNumber = request.get("phoneNumber");
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Phone number is required"
                ));
            }
            
            Map<String, Object> result = farotyService.initiateOtpAuth(phoneNumber);
            
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error sending OTP: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    // Valider l'OTP
    @PostMapping("/auth/otp/validate")
    public ResponseEntity<?> validateOtp(@RequestBody Map<String, String> request) {
        try {
            String phoneNumber = request.get("phoneNumber");
            String otp = request.get("otp");
            
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Phone number is required"
                ));
            }
            
            if (otp == null || otp.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "OTP is required"
                ));
            }
            
            Map<String, Object> result = farotyService.validateOtp(phoneNumber, otp);
            
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error validating OTP: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    // Créer une session de retrait
    @PostMapping("/withdrawal/session/create")
    public ResponseEntity<?> createWithdrawalSession(@RequestBody Map<String, Object> request) {
        try {
            Double amount = (Double) request.get("amount");
            String authToken = (String) request.get("authToken");
            
            if (amount == null || amount <= 0) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Valid amount is required"
                ));
            }
            
            if (authToken == null || authToken.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Authentication token is required"
                ));
            }
            
            Map<String, Object> result = farotyService.createWithdrawalSession(amount, authToken);
            
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error creating withdrawal session: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    // Vérifier le statut d'un paiement
    @GetMapping("/payment/{orderId}/status")
    public ResponseEntity<?> getPaymentStatus(@PathVariable String orderId) {
        try {
            Optional<Payment> paymentOpt = paymentService.getPaymentByOrderId(orderId);
            if (paymentOpt.isPresent()) {
                Payment payment = paymentOpt.get();
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "orderId", orderId,
                    "status", payment.getStatus(),
                    "farotyTransactionId", payment.getFarotyTransactionId(),
                    "paymentReference", payment.getPaymentReference(),
                    "amount", payment.getAmount(),
                    "currency", payment.getCurrency(),
                    "createdAt", payment.getCreatedAt(),
                    "processedAt", payment.getProcessedAt()
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("❌ Error getting payment status: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Error getting payment status");
        }
    }
    
    // Mettre à jour manuellement le statut d'un paiement (pour les callbacks success/cancel)
    @PostMapping("/payment/{orderId}/update")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            String transactionId = request.get("transactionId");
            String reference = request.get("reference");
            
            if (status == null) {
                return ResponseEntity.badRequest().body("Missing status parameter");
            }
            
            // Valider le statut
            if (!status.matches("PENDING|SUCCESS|FAILED|CANCELLED")) {
                return ResponseEntity.badRequest().body("Invalid status");
            }
            
            Payment updatedPayment = paymentService.updatePaymentStatus(orderId, status, transactionId);
            
            // Mettre à jour la référence si fournie
            if (reference != null) {
                updatedPayment.setPaymentReference(reference);
                updatedPayment = paymentService.createPayment(updatedPayment); // Sauvegarder la mise à jour
            }
            
            System.out.println("✅ Payment status updated: " + orderId + " -> " + status);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment status updated successfully",
                "orderId", orderId,
                "status", status,
                "transactionId", transactionId
            ));
            
        } catch (Exception e) {
            System.err.println("❌ Error updating payment status: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Error updating payment status");
        }
    }
    
    // Créer un paiement via Faroty (endpoint alternatif)
    @PostMapping("/payment/create")
    public ResponseEntity<?> createFarotyPayment(@RequestBody PaymentRequest paymentRequest) {
        try {
            System.out.println("💳 Creating Faroty payment: " + paymentRequest);
            
            // Convertir DTO en entité Payment
            Payment payment = new Payment();
            payment.setOrderId(paymentRequest.getOrderId());
            payment.setCustomerName(paymentRequest.getCustomerName());
            payment.setCustomerEmail(paymentRequest.getCustomerEmail());
            payment.setCustomerPhone(paymentRequest.getCustomerPhone());
            payment.setAmount(paymentRequest.getAmount());
            payment.setCurrency(paymentRequest.getCurrency());
            payment.setPaymentMethod(paymentRequest.getPaymentMethod());
            payment.setStatus(paymentRequest.getStatus());
            payment.setPaymentReference(paymentRequest.getPaymentReference());
            payment.setFarotyTransactionId(paymentRequest.getFarotyTransactionId());
            payment.setFarotyWalletId(paymentRequest.getFarotyWalletId());
            
            Payment createdPayment = paymentService.createPayment(payment);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Faroty payment created successfully",
                "payment", createdPayment
            ));
            
        } catch (Exception e) {
            System.err.println("❌ Error creating Faroty payment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error creating Faroty payment");
        }
    }
    
    // Mapper les statuts Faroty vers les statuts internes
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
