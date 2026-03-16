package com.pureskin.etudiant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class StockController {

    @PutMapping("/{id}/stock")
    public ResponseEntity<Map<String, Object>> updateProductStock(
            @PathVariable Long id,
            @RequestBody Map<String, Object> requestBody) {
        
        try {
            Integer quantityChange = (Integer) requestBody.get("quantityChange");
            String operation = (String) requestBody.get("operation");
            
            System.out.println("=== MISE À JOUR STOCK ===");
            System.out.println("Produit ID: " + id);
            System.out.println("Changement: " + quantityChange);
            System.out.println("Opération: " + operation);
            
            // Simulation de mise à jour de stock
            // En production, vous devriez interagir avec votre base de données
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Stock mis à jour avec succès");
            result.put("data", Map.of(
                "id", id,
                "stock_quantity", Math.max(0, 50 - quantityChange), // Simulation
                "previous_quantity", 50, // Simulation
                "quantity_change", quantityChange,
                "operation", operation,
                "updated_at", new Date()
            ));
            
            System.out.println("✅ Stock mis à jour: " + result);
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            System.out.println("❌ Erreur mise à jour stock: " + e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur lors de la mise à jour du stock: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/{id}/stock")
    public ResponseEntity<Map<String, Object>> getProductStock(@PathVariable Long id) {
        try {
            // Simulation de récupération du stock
            // En production, vous devriez récupérer depuis votre base de données
            Map<String, Object> stockInfo = new HashMap<>();
            stockInfo.put("success", true);
            stockInfo.put("data", Map.of(
                "id", id,
                "stock_quantity", 50, // Simulation
                "last_updated", new Date(),
                "low_stock_threshold", 5,
                "is_low_stock", 50 <= 5
            ));
            
            return ResponseEntity.ok(stockInfo);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur lors de la récupération du stock: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
