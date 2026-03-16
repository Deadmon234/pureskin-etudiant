package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.model.Transaction;
import com.pureskin.etudiant.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin/transactions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminTransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        try {
            List<Transaction> transactions = transactionService.getAllTransactions(page, limit, status, startDate, endDate);
            long totalTransactions = transactionService.countTransactions(status, startDate, endDate);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", transactions);
            response.put("pagination", Map.of(
                "page", page,
                "limit", limit,
                "total", totalTransactions,
                "totalPages", (int) Math.ceil((double) totalTransactions / limit)
            ));
            response.put("message", "Transactions récupérées avec succès");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur lors de la récupération des transactions: " + e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getTransactionById(@PathVariable String id) {
        try {
            Transaction transaction = transactionService.getTransactionById(id);
            
            if (transaction == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Transaction non trouvée");
                errorResponse.put("data", null);
                
                return ResponseEntity.status(404).body(errorResponse);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", transaction);
            response.put("message", "Transaction récupérée avec succès");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur lors de la récupération de la transaction: " + e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/webhook/faroty")
    public ResponseEntity<Map<String, Object>> handleFarotyWebhook(@RequestBody Map<String, Object> webhookData) {
        try {
            System.out.println("🔄 Webhook Faroty reçu: " + webhookData);
            
            // Traiter les données du webhook
            String transactionId = (String) webhookData.get("transactionId");
            String status = (String) webhookData.get("status");
            String sessionToken = (String) webhookData.get("sessionToken");
            
            if (transactionId != null && status != null) {
                transactionService.updateTransactionStatus(transactionId, status, webhookData);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Webhook traité avec succès");
                response.put("transactionId", transactionId);
                response.put("status", status);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Données webhook invalides");
                
                return ResponseEntity.badRequest().body(errorResponse);
            }
        } catch (Exception e) {
            System.err.println("❌ Erreur traitement webhook Faroty: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur lors du traitement du webhook");
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/stats/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getTransactionStats() {
        try {
            Map<String, Object> stats = transactionService.getTransactionStats();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", stats);
            response.put("message", "Statistiques des transactions récupérées avec succès");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur lors de la récupération des statistiques: " + e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/{id}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> refundTransaction(
            @PathVariable String id,
            @RequestBody Map<String, Object> refundData) {
        
        try {
            String reason = (String) refundData.get("reason");
            Double refundAmount = refundData.get("amount") != null ? 
                Double.valueOf(refundData.get("amount").toString()) : null;
            
            boolean refundProcessed = transactionService.processRefund(id, reason, refundAmount);
            
            if (refundProcessed) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Remboursement traité avec succès");
                response.put("transactionId", id);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Impossible de traiter le remboursement");
                
                return ResponseEntity.badRequest().body(errorResponse);
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur lors du traitement du remboursement: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
