package com.pureskin.etudiant.repository;

import com.pureskin.etudiant.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Trouver une commande par son numéro unique
    Optional<Order> findByOrderNumber(String orderNumber);
    
    // Trouver les commandes par client ID
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    
    // Trouver les commandes par statut
    List<Order> findByStatusOrderByCreatedAtDesc(String status);
    
    // Trouver les commandes par statut de paiement
    List<Order> findByPaymentStatusOrderByCreatedAtDesc(String paymentStatus);
    
    // Méthodes Faroty (temporairement en commentaire pour tester)
    /*
    // Trouver les commandes par wallet ID
    Optional<Order> findByWalletId(String walletId);
    
    // Trouver les commandes par session token
    Optional<Order> findBySessionToken(String sessionToken);
    
    // Trouver les commandes par utilisateur Faroty
    List<Order> findByFarotyUserIdOrderByCreatedAtDesc(String farotyUserId);
    */
    
    // Compter les commandes par statut
    long countByStatus(String status);
    
    // Compter les commandes par statut de paiement
    long countByPaymentStatus(String paymentStatus);
    
    // Trouver les commandes récentes (derniers 30 jours)
    @Query("SELECT o FROM Order o WHERE o.createdAt >= :since ORDER BY o.createdAt DESC")
    List<Order> findRecentOrders(@Param("since") LocalDateTime since);
    
    // Trouver les commandes par période
    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :startDate AND :endDate ORDER BY o.createdAt DESC")
    List<Order> findOrdersByPeriod(@Param("startDate") LocalDateTime startDate, 
                                  @Param("endDate") LocalDateTime endDate);
    
    // Calculer le chiffre d'affaires total
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.paymentStatus = 'paid'")
    Double calculateTotalRevenue();
    
    // Calculer le chiffre d'affaires par période
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.paymentStatus = 'paid' AND o.createdAt BETWEEN :startDate AND :endDate")
    Double calculateRevenueByPeriod(@Param("startDate") LocalDateTime startDate, 
                                   @Param("endDate") LocalDateTime endDate);
    
    // Trouver les commandes en attente de paiement
    @Query("SELECT o FROM Order o WHERE o.paymentStatus = 'pending' AND o.createdAt >= :since ORDER BY o.createdAt ASC")
    List<Order> findPendingPaymentOrders(@Param("since") LocalDateTime since);
    
    // Statistiques des commandes
    @Query("SELECT " +
           "COUNT(o) as totalOrders, " +
           "COALESCE(SUM(o.totalAmount), 0) as totalRevenue, " +
           "AVG(o.totalAmount) as averageOrderValue " +
           "FROM Order o WHERE o.paymentStatus = 'paid'")
    Object[] getOrderStatistics();
    
    // Compter les commandes créées après une date
    Long countByCreatedAtAfter(LocalDateTime date);
    
    // Calculer le revenu depuis une date
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.createdAt >= :date AND o.paymentStatus = 'paid'")
    Double calculateRevenueSince(@Param("date") LocalDateTime date);
    
    // Pagination avec tri
    org.springframework.data.domain.Page<Order> findAll(org.springframework.data.domain.Pageable pageable);
    
    // Trouver par statut avec pagination
    org.springframework.data.domain.Page<Order> findByStatus(String status, org.springframework.data.domain.Pageable pageable);
}
