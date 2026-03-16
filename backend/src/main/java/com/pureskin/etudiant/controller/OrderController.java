package com.pureskin.etudiant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pureskin.etudiant.model.Customer;
import com.pureskin.etudiant.model.Order;
import com.pureskin.etudiant.model.OrderItem;
import com.pureskin.etudiant.model.Product;
import com.pureskin.etudiant.service.CustomerService;
import com.pureskin.etudiant.service.OrderService;
import com.pureskin.etudiant.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private CustomerService customerService;
    
    @Autowired
    private ProductService productService;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Créer une nouvelle commande
    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody String requestBody) {
        try {
            System.out.println("=== DÉBUT CRÉATION COMMANDE ===");
            System.out.println("Request body reçu: " + requestBody);
            
            // Parser le JSON
            Map<String, Object> request = objectMapper.readValue(requestBody, Map.class);
            
            // Extraire les informations client
            Map<String, Object> customerData = (Map<String, Object>) request.get("customerInfo");
            String email, firstName, lastName, phone, address, city, postalCode, country;
            
            if (customerData != null) {
                email = (String) customerData.get("email");
                firstName = (String) customerData.get("firstName");
                lastName = (String) customerData.get("lastName");
                phone = (String) customerData.get("phone");
                address = (String) customerData.get("address");
                city = (String) customerData.get("city");
                postalCode = (String) customerData.get("postalCode");
                country = (String) customerData.get("country");
            } else {
                // Valeurs par défaut si customerInfo n'est pas fourni
                email = "client@example.com";
                firstName = "Client";
                lastName = "PureSkin";
                phone = "000000000";
                address = "Adresse par défaut";
                city = "Ville";
                postalCode = "00000";
                country = "France";
            }
            
            // Créer ou trouver le client
            Customer customer = customerService.findOrCreateCustomer(
                email, firstName, lastName, phone, address, city, postalCode, country
            );
            
            System.out.println("Client créé/trouvé: ID=" + customer.getId() + ", Email=" + customer.getEmail());
            
            // Extraire les informations de commande
            String shippingAddress = (String) request.get("shippingAddress");
            String billingAddress = (String) request.get("billingAddress");
            
            // Gérer les valeurs numériques avec valeurs par défaut
            BigDecimal subtotal = request.get("subtotal") != null ? 
                new BigDecimal(request.get("subtotal").toString()) : BigDecimal.ZERO;
            BigDecimal shippingCost = request.get("shippingCost") != null ? 
                new BigDecimal(request.get("shippingCost").toString()) : BigDecimal.ZERO;
            BigDecimal taxAmount = request.get("taxAmount") != null ? 
                new BigDecimal(request.get("taxAmount").toString()) : BigDecimal.ZERO;
            BigDecimal totalAmount = request.get("totalAmount") != null ? 
                new BigDecimal(request.get("totalAmount").toString()) : BigDecimal.ZERO;
            String notes = (String) request.get("notes");
            
            // Extraire les articles avec gestion du cas null
            List<Map<String, Object>> itemsData = (List<Map<String, Object>>) request.get("items");
            List<OrderItem> orderItems = new ArrayList<>();
            
            if (itemsData != null) {
                for (Map<String, Object> itemData : itemsData) {
                    OrderItem item = new OrderItem();
                    
                    // Récupérer et valider les prix avec valeurs par défaut
                    BigDecimal price = itemData.get("price") != null ? 
                        new BigDecimal(itemData.get("price").toString()) : BigDecimal.ZERO;
                    BigDecimal totalPrice = itemData.get("totalPrice") != null ? 
                        new BigDecimal(itemData.get("totalPrice").toString()) : BigDecimal.ZERO;
                    
                    // Valider et vérifier le productId
                    Long productId = null;
                    if (itemData.get("productId") != null) {
                        productId = Long.valueOf(itemData.get("productId").toString());
                        
                        // Vérifier que le produit existe dans la base de données
                        Product product = productService.getProductById(productId);
                        if (product == null) {
                            System.out.println("ERREUR: Produit ID " + productId + " non trouvé dans la base de données");
                            
                            Map<String, Object> errorResponse = new HashMap<>();
                            errorResponse.put("success", false);
                            errorResponse.put("message", "Produit avec ID " + productId + " non trouvé. Impossible de créer la commande.");
                            return ResponseEntity.badRequest().body(errorResponse);
                        }
                        
                        System.out.println("Produit trouvé: ID=" + productId + ", Nom=" + product.getName());
                        
                        // Utiliser les données du produit si nécessaire
                        if (itemData.get("productName") == null) {
                            item.setProductName(product.getName());
                        }
                        if (itemData.get("productImage") == null) {
                            item.setProductImage(product.getImageUrl());
                        }
                    }
                    
                    if (itemData.get("quantity") != null) {
                        item.setQuantity(Integer.valueOf(itemData.get("quantity").toString()));
                    }
                    
                    // S'assurer que les prix ne sont jamais null
                    item.setUnitPrice(price);
                    item.setTotalPrice(totalPrice);
                    
                    // Ajouter les champs manquants
                    if (productId != null) {
                        item.setProductId(productId);
                    }
                    item.setProductName((String) itemData.get("productName"));
                    item.setProductImage((String) itemData.get("productImage"));
                    orderItems.add(item);
                }
            }
            
            // Créer la commande
            Order order = orderService.createOrderWithDetails(
                customer.getId(), shippingAddress, billingAddress,
                subtotal, shippingCost, taxAmount, totalAmount,
                orderItems, notes
            );
            
            System.out.println("Commande créée: ID=" + order.getId() + ", Numéro=" + order.getOrderNumber());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Commande créée avec succès");
            response.put("data", Map.of(
                "orderId", order.getId(),
                "orderNumber", order.getOrderNumber(),
                "customerId", order.getCustomerId(),
                "totalAmount", order.getTotalAmount(),
                "status", order.getStatus(),
                "paymentStatus", order.getPaymentStatus(),
                "createdAt", order.getCreatedAt()
            ));
            
            System.out.println("=== COMMANDE CRÉÉE AVEC SUCCÈS ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("=== ERREUR COMMANDE ===");
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de la création de la commande: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Obtenir une commande par ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getOrderById(@PathVariable Long id) {
        try {
            System.out.println("=== RÉCUPÉRATION COMMANDE ID: " + id + " ===");
            
            Optional<Order> orderOpt = orderService.getOrderById(id);
            if (orderOpt.isEmpty()) {
                System.out.println("Commande non trouvée: " + id);
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Commande non trouvée");
                return ResponseEntity.notFound().build();
            }
            
            // Convertir les OrderItems en format pour le frontend
            List<Map<String, Object>> items = new ArrayList<>();
            for (OrderItem item : orderOpt.get().getOrderItems()) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", item.getProductId());
                itemMap.put("name", item.getProductName());
                itemMap.put("description", ""); // Pas de description dans OrderItem
                itemMap.put("price", item.getUnitPrice());
                itemMap.put("imageUrl", item.getProductImage());
                itemMap.put("quantity", item.getQuantity());
                itemMap.put("totalPrice", item.getTotalPrice());
                items.add(itemMap);
            }
            
            Map<String, Object> orderData = new HashMap<>();
            orderData.put("items", items);
            orderData.put("totalAmount", orderOpt.get().getTotalAmount());
            orderData.put("orderNumber", orderOpt.get().getOrderNumber());
            orderData.put("customerEmail", orderOpt.get().getCustomerEmail());
            orderData.put("subtotal", orderOpt.get().getSubtotal());
            orderData.put("shippingCost", orderOpt.get().getShippingCost());
            orderData.put("taxAmount", orderOpt.get().getTaxAmount());
            orderData.put("status", orderOpt.get().getStatus());
            orderData.put("paymentStatus", orderOpt.get().getPaymentStatus());
            orderData.put("createdAt", orderOpt.get().getCreatedAt());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", orderData);
            
            System.out.println("=== COMMANDE RÉCUPÉRÉE AVEC SUCCÈS ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("=== ERREUR RÉCUPÉRATION COMMANDE ===");
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de la récupération de la commande: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Mettre à jour les informations de paiement d'une commande
    @PostMapping("/{orderId}/payment-info")
    public ResponseEntity<Map<String, Object>> updateOrderPaymentInfo(
            @PathVariable Long orderId, 
            @RequestBody Map<String, Object> paymentInfo) {
        try {
            System.out.println("=== MISE À JOUR INFO PAIEMENT COMMANDE ===");
            System.out.println("Order ID: " + orderId);
            System.out.println("Payment Info: " + paymentInfo);
            
            // Récupérer la commande
            Optional<Order> orderOpt = orderService.getOrderById(orderId);
            if (!orderOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Commande non trouvée");
                return ResponseEntity.notFound().build();
            }
            
            Order order = orderOpt.get();
            
            // Mettre à jour les informations de paiement
            String walletId = (String) paymentInfo.get("walletId");
            String sessionToken = (String) paymentInfo.get("sessionToken");
            String farotyUserId = (String) paymentInfo.get("farotyUserId");
            
            if (walletId != null) {
                order.setWalletId(walletId);
            }
            if (sessionToken != null && !sessionToken.isEmpty()) {
                order.setSessionToken(sessionToken);
            }
            if (farotyUserId != null) {
                order.setFarotyUserId(farotyUserId);
            }
            
            // Sauvegarder la commande
            orderService.saveOrder(order);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Informations de paiement mises à jour avec succès");
            response.put("orderId", orderId);
            
            System.out.println("=== INFO PAIEMENT MISE À JOUR AVEC SUCCÈS ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("=== ERREUR MISE À JOUR INFO PAIEMENT ===");
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de la mise à jour des informations de paiement: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
