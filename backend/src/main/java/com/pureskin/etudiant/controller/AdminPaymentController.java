package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.model.Transaction;
import com.pureskin.etudiant.model.TransactionStatus;
import com.pureskin.etudiant.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin/payment-methods")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminPaymentController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPaymentMethodStats() {
        try {
            List<Transaction> allTransactions = transactionService.getAllTransactions(0, 10000, null, null, null);
            Map<String, Object> paymentStats = new HashMap<>();
            Map<String, Long> methodCounts = new HashMap<>();
            Map<String, Double> methodAmounts = new HashMap<>();
            
            for (Transaction transaction : allTransactions) {
                String method = transaction.getPaymentMethod();
                if (method != null) {
                    methodCounts.put(method, methodCounts.getOrDefault(method, 0L) + 1);
                    if (transaction.getStatus() == TransactionStatus.COMPLETED) {
                        methodAmounts.put(method, methodAmounts.getOrDefault(method, 0.0) + transaction.getAmount());
                    }
                }
            }
            
            paymentStats.put("methodCounts", methodCounts);
            paymentStats.put("methodAmounts", methodAmounts);
            paymentStats.put("totalTransactions", allTransactions.size());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", paymentStats);
            response.put("message", "Statistiques des méthodes de paiement récupérées avec succès");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur lors de la récupération des statistiques: " + e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/transactions/{paymentMethod}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getTransactionsByPaymentMethod(@PathVariable String paymentMethod) {
        try {
            List<Transaction> allTransactions = transactionService.getAllTransactions(0, 10000, null, null, null);
            List<Transaction> filteredTransactions = allTransactions.stream()
                .filter(t -> paymentMethod.equals(t.getPaymentMethod()))
                .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", filteredTransactions);
            response.put("message", "Transactions pour la méthode de paiement " + paymentMethod + " récupérées avec succès");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur lors de la récupération des transactions: " + e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/transactions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllTransactions() {
        try {
            List<Transaction> transactions = transactionService.getAllTransactions(0, 10000, null, null, null);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", transactions);
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

    @GetMapping("/overview")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPaymentOverview() {
        try {
            Map<String, Object> transactionStats = transactionService.getTransactionStats();
            
            // Ajouter les informations du compte
            Map<String, Object> accountInfo = new HashMap<>();
            accountInfo.put("accountId", "816ac7c4-f55d-4c90-9772-92ca78e2ab17");
            accountInfo.put("publicKey", "fk_live_mhZG1htEBgK02jvI5QZqNYTpzgdfFmMCisI8cho4KbxqSD9uq2l6h39XppRSayQVTtAj5pCAjRU");
            accountInfo.put("provider", "Flutterwave");
            
            transactionStats.put("accountInfo", accountInfo);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", transactionStats);
            response.put("message", "Aperçu des paiements récupéré avec succès");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur lors de la récupération de l'aperçu: " + e.getMessage());
            errorResponse.put("data", null);
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
