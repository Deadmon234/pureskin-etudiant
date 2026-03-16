package com.pureskin.etudiant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3002"})
public class ProductQuantityController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PutMapping("/{id}/quantity")
    public ResponseEntity<Map<String, Object>> updateProductQuantity(
            @PathVariable Long id,
            @RequestBody Map<String, Object> requestBody) {
        
        try {
            Integer newQuantity = (Integer) requestBody.get("quantity");
            String operation = (String) requestBody.get("operation");
            
            System.out.println("=== MISE À JOUR QUANTITÉ PRODUIT ===");
            System.out.println("Produit ID: " + id);
            System.out.println("Nouvelle quantité: " + newQuantity);
            System.out.println("Opération: " + operation);
            
            // Vérifier si le produit existe
            String checkSql = "SELECT COUNT(*) FROM products WHERE id = ?";
            Integer exists = jdbcTemplate.queryForObject(checkSql, Integer.class, id);
            
            if (exists == 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Produit non trouvé");
                return ResponseEntity.status(404).body(errorResponse);
            }
            
            // Récupérer l'ancienne quantité
            String getOldQuantitySql = "SELECT stock_quantity FROM products WHERE id = ?";
            Integer oldQuantity = jdbcTemplate.queryForObject(getOldQuantitySql, Integer.class, id);
            
            int updatedQuantity;
            String sql;
            
            if ("add".equals(operation)) {
                // Ajouter un nouveau produit avec quantité
                sql = "UPDATE products SET stock_quantity = ?, is_active = true, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
                updatedQuantity = newQuantity;
                System.out.println("🆕 Ajout du produit avec quantité: " + newQuantity);
            } else if ("update".equals(operation)) {
                // Mettre à jour la quantité d'un produit existant
                sql = "UPDATE products SET stock_quantity = ?, is_active = (CASE WHEN ? > 0 THEN true ELSE false END), updated_at = CURRENT_TIMESTAMP WHERE id = ?";
                updatedQuantity = newQuantity;
                System.out.println("📝 Mise à jour quantité du produit: " + oldQuantity + " -> " + newQuantity);
            } else if ("decrease".equals(operation)) {
                // Diminuer la quantité (pour les commandes)
                updatedQuantity = Math.max(0, oldQuantity - newQuantity);
                sql = "UPDATE products SET stock_quantity = ?, is_active = (CASE WHEN ? > 0 THEN true ELSE false END), updated_at = CURRENT_TIMESTAMP WHERE id = ?";
                System.out.println("📉 Diminution quantité du produit: " + oldQuantity + " -> " + updatedQuantity);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Opération non valide: " + operation);
                return ResponseEntity.status(400).body(errorResponse);
            }
            
            // Exécuter la mise à jour
            int rowsAffected = jdbcTemplate.update(sql, newQuantity, id);
            
            if (rowsAffected > 0) {
                // Récupérer les informations mises à jour
                String getUpdatedSql = "SELECT id, name, stock_quantity, is_active, updated_at FROM products WHERE id = ?";
                Map<String, Object> updatedProduct = jdbcTemplate.queryForMap(getUpdatedSql, id);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Quantité mise à jour avec succès");
                response.put("data", updatedProduct);
                response.put("operation", operation);
                response.put("previous_quantity", oldQuantity);
                response.put("new_quantity", newQuantity);
                response.put("quantity_change", newQuantity - oldQuantity);
                
                System.out.println("✅ Quantité mise à jour avec succès:");
                System.out.println("  - Ancienne quantité: " + oldQuantity);
                System.out.println("  - Nouvelle quantité: " + updatedQuantity);
                System.out.println("  - Changement: " + (updatedQuantity - oldQuantity));
                System.out.println("  - Opération: " + operation);
                System.out.println("  - Produit activé: " + updatedProduct.get("is_active"));
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Aucune modification effectuée");
                return ResponseEntity.status(400).body(errorResponse);
            }
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la mise à jour de la quantité:");
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur lors de la mise à jour de la quantité: " + e.getMessage());
            errorResponse.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/{id}/quantity")
    public ResponseEntity<Map<String, Object>> getProductQuantity(@PathVariable Long id) {
        try {
            System.out.println("=== RÉCUPÉRATION QUANTITÉ PRODUIT ===");
            System.out.println("Produit ID: " + id);
            
            String sql = "SELECT id, name, stock_quantity, is_active, updated_at, created_at FROM products WHERE id = ?";
            Map<String, Object> product = jdbcTemplate.queryForMap(sql, id);
            
            if (product == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Produit non trouvé");
                return ResponseEntity.status(404).body(errorResponse);
            }
            
            // Ajouter des informations supplémentaires
            Integer currentStock = (Integer) product.get("stock_quantity");
            product.put("low_stock_threshold", 5);
            product.put("is_low_stock", currentStock != null && currentStock <= 5);
            product.put("is_out_of_stock", currentStock != null && currentStock <= 0);
            product.put("stock_status", getStockStatus(currentStock));
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", product);
            response.put("message", "Informations de quantité récupérées");
            
            System.out.println("✅ Informations quantité récupérées:");
            System.out.println("  - Quantité actuelle: " + currentStock);
            System.out.println("  - Statut: " + getStockStatus(currentStock));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la récupération de la quantité:");
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Erreur lors de la récupération de la quantité: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    private String getStockStatus(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            return "OUT_OF_STOCK";
        } else if (quantity <= 5) {
            return "LOW_STOCK";
        } else {
            return "IN_STOCK";
        }
    }
}
