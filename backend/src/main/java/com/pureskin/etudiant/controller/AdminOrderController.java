package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.model.Order;
import com.pureskin.etudiant.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class AdminOrderController {
    
    @Autowired
    private OrderService orderService;
    
    // Obtenir toutes les commandes avec pagination
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String status) {
        try {
            System.out.println("=== RÉCUPÉRATION COMMANDES ADMIN ===");
            System.out.println("Page: " + page + ", Limit: " + limit + ", Status: " + status);
            
            // Créer un pageable avec tri par date décroissante
            Pageable pageable = PageRequest.of(page, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
            
            Page<Order> ordersPage;
            if (status != null && !status.isEmpty()) {
                ordersPage = orderService.findByStatus(status, pageable);
            } else {
                ordersPage = orderService.findAll(pageable);
            }
            
            // Convertir les commandes en format de réponse
            List<Map<String, Object>> ordersData = ordersPage.getContent().stream()
                .map(order -> {
                    Map<String, Object> orderData = new HashMap<>();
                    orderData.put("id", order.getId());
                    orderData.put("orderNumber", order.getOrderNumber());
                    orderData.put("status", order.getStatus());
                    orderData.put("paymentStatus", order.getPaymentStatus());
                    orderData.put("totalAmount", order.getTotalAmount());
                    orderData.put("currency", order.getCurrency());
                    orderData.put("createdAt", order.getCreatedAt());
                    orderData.put("customerName", getCustomerName(order));
                    orderData.put("customerEmail", getCustomerEmail(order));
                    orderData.put("itemsCount", order.getOrderItems().size());
                    return orderData;
                })
                .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orders", ordersData);
            response.put("currentPage", ordersPage.getNumber());
            response.put("totalPages", ordersPage.getTotalPages());
            response.put("totalItems", ordersPage.getTotalElements());
            response.put("hasNext", ordersPage.hasNext());
            response.put("hasPrevious", ordersPage.hasPrevious());
            
            System.out.println("=== COMMANDES ADMIN RÉCUPÉRÉES: " + ordersData.size() + " ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("=== ERREUR RÉCUPÉRATION COMMANDES ADMIN ===");
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de la récupération des commandes: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // Obtenir les commandes récentes (limité)
    @GetMapping("/recent")
    public ResponseEntity<Map<String, Object>> getRecentOrders(
            @RequestParam(defaultValue = "5") int limit) {
        try {
            System.out.println("=== RÉCUPÉRATION COMMANDES RÉCENTES ===");
            
            Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
            Page<Order> ordersPage = orderService.findAll(pageable);
            
            List<Map<String, Object>> ordersData = ordersPage.getContent().stream()
                .map(order -> {
                    Map<String, Object> orderData = new HashMap<>();
                    orderData.put("id", order.getOrderNumber()); // Utiliser orderNumber pour le frontend
                    orderData.put("customerName", getCustomerName(order));
                    orderData.put("email", getCustomerEmail(order));
                    orderData.put("total", order.getTotalAmount());
                    orderData.put("status", order.getStatus());
                    orderData.put("date", order.getCreatedAt());
                    orderData.put("items", order.getOrderItems().size());
                    return orderData;
                })
                .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orders", ordersData);
            
            System.out.println("=== COMMANDES RÉCENTES RÉCUPÉRÉES: " + ordersData.size() + " ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("=== ERREUR COMMANDES RÉCENTES ===");
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de la récupération des commandes récentes: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // Obtenir une commande spécifique
    @GetMapping("/{orderId}")
    public ResponseEntity<Map<String, Object>> getOrderById(@PathVariable Long orderId) {
        try {
            System.out.println("=== RÉCUPÉRATION COMMANDE ADMIN: " + orderId + " ===");
            
            Optional<Order> orderOpt = orderService.getOrderById(orderId);
            if (!orderOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Commande non trouvée");
                return ResponseEntity.notFound().build();
            }
            
            Order order = orderOpt.get();
            
            Map<String, Object> orderData = new HashMap<>();
            orderData.put("id", order.getId());
            orderData.put("orderNumber", order.getOrderNumber());
            orderData.put("status", order.getStatus());
            orderData.put("paymentStatus", order.getPaymentStatus());
            orderData.put("paymentMethod", order.getPaymentMethod());
            orderData.put("totalAmount", order.getTotalAmount());
            orderData.put("subtotal", order.getSubtotal());
            orderData.put("shippingCost", order.getShippingCost());
            orderData.put("taxAmount", order.getTaxAmount());
            orderData.put("currency", order.getCurrency());
            orderData.put("shippingAddress", order.getShippingAddress());
            orderData.put("billingAddress", order.getBillingAddress());
            orderData.put("trackingNumber", order.getTrackingNumber());
            orderData.put("notes", order.getNotes());
            orderData.put("walletId", order.getWalletId());
            orderData.put("sessionToken", order.getSessionToken());
            orderData.put("farotyUserId", order.getFarotyUserId());
            orderData.put("createdAt", order.getCreatedAt());
            orderData.put("updatedAt", order.getUpdatedAt());
            orderData.put("paidAt", order.getPaidAt());
            orderData.put("shippedAt", order.getShippedAt());
            orderData.put("deliveredAt", order.getDeliveredAt());
            orderData.put("customerName", getCustomerName(order));
            orderData.put("customerEmail", getCustomerEmail(order));
            
            // Ajouter les items
            List<Map<String, Object>> itemsData = order.getOrderItems().stream()
                .map(item -> {
                    Map<String, Object> itemData = new HashMap<>();
                    itemData.put("id", item.getId());
                    itemData.put("productName", item.getProductName());
                    itemData.put("quantity", item.getQuantity());
                    itemData.put("unitPrice", item.getUnitPrice());
                    itemData.put("totalPrice", item.getTotalPrice());
                    return itemData;
                })
                .toList();
            orderData.put("items", itemsData);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("order", orderData);
            
            System.out.println("=== COMMANDE ADMIN RÉCUPÉRÉE AVEC SUCCÈS ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("=== ERREUR RÉCUPÉRATION COMMANDE ADMIN ===");
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de la récupération de la commande: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // Mettre à jour le statut d'une commande
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> statusRequest) {
        try {
            System.out.println("=== MISE À JOUR STATUT COMMANDE: " + orderId + " ===");
            
            String newStatus = statusRequest.get("status");
            if (newStatus == null || newStatus.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Statut requis");
                return ResponseEntity.badRequest().body(response);
            }
            
            Optional<Order> orderOpt = orderService.getOrderById(orderId);
            if (!orderOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Commande non trouvée");
                return ResponseEntity.notFound().build();
            }
            
            Order order = orderOpt.get();
            order.setStatus(newStatus);
            orderService.saveOrder(order);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Statut de commande mis à jour avec succès");
            response.put("orderId", orderId);
            response.put("newStatus", newStatus);
            
            System.out.println("=== STATUT COMMANDE MIS À JOUR AVEC SUCCÈS ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("=== ERREUR MISE À JOUR STATUT COMMANDE ===");
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de la mise à jour du statut: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // Méthodes utilitaires
    private String getCustomerName(Order order) {
        if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
            return order.getOrderItems().get(0).getCustomerName();
        }
        return "Client inconnu";
    }
    
    private String getCustomerEmail(Order order) {
        if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
            return order.getOrderItems().get(0).getCustomerEmail();
        }
        return "email@inconnu.com";
    }
}
