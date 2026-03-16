package com.pureskin.etudiant.service;

import com.pureskin.etudiant.model.Order;
import com.pureskin.etudiant.model.OrderItem;
import com.pureskin.etudiant.repository.OrderRepository;
import com.pureskin.etudiant.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    // Créer une nouvelle commande
    public Order createOrder(Long customerId, BigDecimal subtotal, BigDecimal shippingCost, BigDecimal taxAmount, BigDecimal totalAmount, List<OrderItem> items) {
        Order order = new Order(customerId, totalAmount);
        order.setSubtotal(subtotal);
        order.setShippingCost(shippingCost);
        order.setTaxAmount(taxAmount);
        
        // Sauvegarder la commande
        order = orderRepository.save(order);
        
        // Ajouter les articles
        if (items != null && !items.isEmpty()) {
            for (OrderItem item : items) {
                item.setOrder(order);
                orderItemRepository.save(item);
            }
        }
        
        return order;
    }
    
    // Créer une commande avec informations complètes
    public Order createOrderWithDetails(Long customerId, String shippingAddress, String billingAddress,
                                       BigDecimal subtotal, BigDecimal shippingCost, BigDecimal taxAmount,
                                       BigDecimal totalAmount, List<OrderItem> items, String notes) {
        Order order = new Order(customerId, totalAmount);
        order.setSubtotal(subtotal);
        order.setShippingCost(shippingCost);
        order.setTaxAmount(taxAmount);
        order.setShippingAddress(shippingAddress);
        order.setBillingAddress(billingAddress);
        order.setNotes(notes);
        
        // Sauvegarder la commande
        order = orderRepository.save(order);
        
        // Ajouter les articles
        if (items != null && !items.isEmpty()) {
            for (OrderItem item : items) {
                item.setOrder(order);
                orderItemRepository.save(item);
            }
        }
        
        return order;
    }
    
    // Mettre à jour les informations de paiement (temporairement en commentaire pour tester)
    /*
    public Order updatePaymentInfo(Long orderId, String walletId, String sessionToken, String farotyUserId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setWalletId(walletId);
            order.setSessionToken(sessionToken);
            order.setFarotyUserId(farotyUserId);
            order.setPaymentMethod("Faroty Wallet");
            return orderRepository.save(order);
        }
        throw new RuntimeException("Commande non trouvée avec l'ID: " + orderId);
    }
    
    // Marquer une commande comme payée
    public Order markOrderAsPaid(String sessionToken) {
        Optional<Order> orderOpt = orderRepository.findBySessionToken(sessionToken);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.markAsPaid();
            order.markAsConfirmed();
            return orderRepository.save(order);
        }
        throw new RuntimeException("Commande non trouvée avec le session token: " + sessionToken);
    }
    
    // Marquer une commande comme payée par wallet ID
    public Order markOrderAsPaidByWalletId(String walletId) {
        Optional<Order> orderOpt = orderRepository.findByWalletId(walletId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.markAsPaid();
            order.markAsConfirmed();
            return orderRepository.save(order);
        }
        throw new RuntimeException("Commande non trouvée avec le wallet ID: " + walletId);
    }
    */
    
    // Marquer une commande comme expédiée
    public Order markOrderAsShipped(Long orderId, String trackingNumber) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.markAsShipped(trackingNumber);
            return orderRepository.save(order);
        }
        throw new RuntimeException("Commande non trouvée avec l'ID: " + orderId);
    }
    
    // Marquer une commande comme livrée
    public Order markOrderAsDelivered(Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.markAsDelivered();
            return orderRepository.save(order);
        }
        throw new RuntimeException("Commande non trouvée avec l'ID: " + orderId);
    }
    
    // Annuler une commande
    public Order cancelOrder(Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.markAsCancelled();
            return orderRepository.save(order);
        }
        throw new RuntimeException("Commande non trouvée avec l'ID: " + orderId);
    }
    
    // Trouver une commande par son numéro
    public Optional<Order> findByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }
    
    // Trouver une commande par session token (temporairement en commentaire pour tester)
    /*
    public Optional<Order> findBySessionToken(String sessionToken) {
        return orderRepository.findBySessionToken(sessionToken);
    }
    */
    
    // Trouver une commande par wallet ID (temporairement en commentaire pour tester)
    /*
    public Optional<Order> findByWalletId(String walletId) {
        return orderRepository.findByWalletId(walletId);
    }
    */
    
    // Obtenir une commande par ID
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }
    
    // Mettre à jour le statut de la commande via sessionToken (webhook Faroty)
    public Order updateOrderStatusBySessionToken(
        String sessionToken, 
        String status, 
        String paymentStatus,
        String walletId,
        Double amount,
        String currency
    ) {
        try {
            System.out.println("Recherche commande avec sessionToken: " + sessionToken);
            
            // Pour l'instant, nous n'avons pas de champ sessionToken dans la base de données
            // Nous allons chercher par walletId ou par numéro de commande récent
            Order order = null;
            
            if (walletId != null) {
                // Chercher par walletId (temporairement commenté car le champ n'existe pas encore)
                // order = findOrderByWalletId(walletId);
                System.out.println("Recherche par walletId non implémentée (champ walletId non existant)");
            }
            
            // Si aucune commande trouvée, chercher les commandes récentes
            if (order == null) {
                List<Order> recentOrders = getRecentOrders();
                if (!recentOrders.isEmpty()) {
                    order = recentOrders.get(0); // Prendre la commande la plus récente
                    System.out.println("Utilisation de la commande la plus récente: " + order.getOrderNumber());
                }
            }
            
            if (order != null) {
                System.out.println("Commande trouvée: " + order.getOrderNumber());
                System.out.println("Ancien statut: " + order.getStatus() + " / " + order.getPaymentStatus());
                
                // Mettre à jour le statut
                order.setStatus(status);
                order.setPaymentStatus(paymentStatus);
                
                // Si le paiement est complété, mettre à jour la date de paiement
                if ("COMPLETED".equals(paymentStatus) && order.getPaidAt() == null) {
                    order.setPaidAt(java.time.LocalDateTime.now());
                }
                
                // Sauvegarder les modifications
                Order updatedOrder = orderRepository.save(order);
                
                System.out.println("Commande mise à jour: " + updatedOrder.getOrderNumber());
                System.out.println("Nouveau statut: " + updatedOrder.getStatus() + " / " + updatedOrder.getPaymentStatus());
                
                return updatedOrder;
            } else {
                System.out.println("Aucune commande trouvée pour le sessionToken: " + sessionToken);
                return null;
            }
            
        } catch (Exception e) {
            System.out.println("Erreur mise à jour commande par sessionToken: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la mise à jour de la commande: " + e.getMessage());
        }
    }
    
    // Obtenir les commandes d'un client
    public List<Order> getCustomerOrders(Long customerId) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }
    
    // Obtenir les commandes par statut
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status);
    }
    
    // Obtenir les commandes par statut de paiement
    public List<Order> getOrdersByPaymentStatus(String paymentStatus) {
        return orderRepository.findByPaymentStatusOrderByCreatedAtDesc(paymentStatus);
    }
    
    // Obtenir tous les articles d'une commande
    public List<OrderItem> getOrderItems(Long orderId) {
        return orderItemRepository.findByOrderIdOrderByCreatedAtAsc(orderId);
    }
    
    // Mettre à jour le statut d'une commande
    public Order updateOrderStatus(Long orderId, String newStatus) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(newStatus);
            return orderRepository.save(order);
        }
        throw new RuntimeException("Commande non trouvée avec l'ID: " + orderId);
    }
    
    // Obtenir les statistiques des commandes
    public Object[] getOrderStatistics() {
        return orderRepository.getOrderStatistics();
    }
    
    // Calculer le chiffre d'affaires total
    public Double getTotalRevenue() {
        return orderRepository.calculateTotalRevenue();
    }
    
    // Obtenir les commandes récentes
    public List<Order> getRecentOrders() {
        return orderRepository.findRecentOrders(LocalDateTime.now().minusDays(30));
    }
    
    // Obtenir les commandes en attente de paiement
    public List<Order> getPendingPaymentOrders() {
        return orderRepository.findPendingPaymentOrders(LocalDateTime.now().minusHours(1));
    }
    
    // Obtenir les statistiques pour le dashboard
    public java.util.Map<String, Object> getOrderStats() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        
        Long totalOrders = orderRepository.count();
        stats.put("totalOrders", totalOrders);
        
        Double totalRevenue = orderRepository.calculateTotalRevenue();
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
        
        Long pendingOrders = orderRepository.countByStatus("pending");
        stats.put("pendingOrders", pendingOrders);
        
        return stats;
    }
    
    // Obtenir les statistiques mensuelles
    public java.util.Map<String, Object> getMonthlyStats(LocalDateTime monthStart) {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        
        Long monthlyOrders = orderRepository.countByCreatedAtAfter(monthStart);
        stats.put("monthlyOrders", monthlyOrders);
        
        Double monthlyRevenue = orderRepository.calculateRevenueSince(monthStart);
        stats.put("monthlyRevenue", monthlyRevenue != null ? monthlyRevenue : 0.0);
        
        return stats;
    }
    
    // Sauvegarder une commande (pour les mises à jour)
    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }
    
    // Obtenir toutes les commandes avec pagination
    public org.springframework.data.domain.Page<Order> findAll(org.springframework.data.domain.Pageable pageable) {
        return orderRepository.findAll(pageable);
    }
    
    // Obtenir les commandes par statut avec pagination
    public org.springframework.data.domain.Page<Order> findByStatus(String status, org.springframework.data.domain.Pageable pageable) {
        return orderRepository.findByStatus(status, pageable);
    }
}
