package com.pureskin.etudiant.repository;

import com.pureskin.etudiant.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    // Trouver les articles par commande
    List<OrderItem> findByOrderIdOrderByCreatedAtAsc(Long orderId);
    
    // Trouver les articles par produit
    List<OrderItem> findByProductIdOrderByCreatedAtDesc(Long productId);
    
    // Compter les articles par commande
    long countByOrderId(Long orderId);
    
    // Calculer le total des articles par commande
    @Query("SELECT COALESCE(SUM(oi.totalPrice), 0) FROM OrderItem oi WHERE oi.order.id = :orderId")
    Double calculateOrderTotal(@Param("orderId") Long orderId);
    
    // Trouver les produits les plus vendus
    @Query("SELECT oi.productId, oi.productName, SUM(oi.quantity) as totalSold, SUM(oi.totalPrice) as totalRevenue " +
           "FROM OrderItem oi " +
           "GROUP BY oi.productId, oi.productName " +
           "ORDER BY totalSold DESC")
    List<Object[]> findTopSellingProducts();
    
    // Trouver les produits les plus vendus (limité)
    @Query("SELECT oi.productId, oi.productName, SUM(oi.quantity) as totalSold, SUM(oi.totalPrice) as totalRevenue " +
           "FROM OrderItem oi " +
           "GROUP BY oi.productId, oi.productName " +
           "ORDER BY totalSold DESC " +
           "LIMIT :limit")
    List<Object[]> findTopSellingProducts(@Param("limit") int limit);
}
