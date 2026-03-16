package com.pureskin.etudiant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class OrderPaymentController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/{orderId}/payment-success")
    public ResponseEntity<Map<String, Object>> handlePaymentSuccess(
            @PathVariable Long orderId,
            @RequestBody Map<String, Object> requestBody) {
        
        try {
            String sessionToken = (String) requestBody.get("sessionToken");
            String paymentMethod = (String) requestBody.get("paymentMethod");
            String status = (String) requestBody.get("status");
            
            System.out.println("=== PAIEMENT RÉUSSI ===");
            System.out.println("Order ID: " + orderId);
            System.out.println("Session Token: " + sessionToken);
            System.out.println("Payment Method: " + paymentMethod);
            System.out.println("Status: " + status);
            
            // Mettre à jour le statut de la commande
            String updateOrderSql = "UPDATE orders SET status = ?, payment_method = ?, payment_session_token = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            int rowsAffected = jdbcTemplate.update(updateOrderSql, status, paymentMethod, sessionToken, orderId);
            
            if (rowsAffected > 0) {
                // Récupérer les détails de la commande mise à jour
                String getOrderSql = "SELECT * FROM orders WHERE id = ?";
                Map<String, Object> order = jdbcTemplate.queryForMap(getOrderSql, orderId);
                
                // Récupérer les items de la commande
                String getItemsSql = "SELECT * FROM order_items WHERE order_id = ?";
                List<Map<String, Object>> items = jdbcTemplate.queryForList(getItemsSql, orderId);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Paiement enregistré avec succès");
                response.put("data", order);
                response.put("items", items);
                
                System.out.println("✅ Paiement enregistré avec succès pour la commande #" + orderId);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Commande non trouvée");
                return ResponseEntity.status(404).body(errorResponse);
            }
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de l'enregistrement du paiement:");
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur lors de l'enregistrement du paiement: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/{orderId}/payment-cancelled")
    public ResponseEntity<Map<String, Object>> handlePaymentCancelled(
            @PathVariable Long orderId,
            @RequestBody Map<String, Object> requestBody) {
        
        try {
            String sessionToken = (String) requestBody.get("sessionToken");
            String reason = (String) requestBody.get("reason");
            
            System.out.println("=== PAIEMENT ANNULÉ ===");
            System.out.println("Order ID: " + orderId);
            System.out.println("Session Token: " + sessionToken);
            System.out.println("Reason: " + reason);
            
            // Mettre à jour le statut de la commande
            String updateOrderSql = "UPDATE orders SET status = ?, payment_session_token = ?, cancellation_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            int rowsAffected = jdbcTemplate.update(updateOrderSql, "CANCELLED", sessionToken, reason, orderId);
            
            if (rowsAffected > 0) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Annulation de paiement enregistrée");
                
                System.out.println("✅ Annulation enregistrée pour la commande #" + orderId);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Commande non trouvée");
                return ResponseEntity.status(404).body(errorResponse);
            }
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de l'enregistrement de l'annulation:");
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur lors de l'enregistrement de l'annulation: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
