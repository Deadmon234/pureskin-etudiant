package com.pureskin.etudiant.repository;

import com.pureskin.etudiant.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByIsActive(Boolean isActive);
    
    long countByIsActive(boolean isActive);
    
    List<Product> findByCategory(String category);
    
    List<Product> findByIsPromotional(boolean isPromotional);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.stockQuantity > 0")
    List<Product> findAvailableProducts();
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND (p.badge = 'featured' OR p.originalPrice > p.price)")
    List<Product> findFeaturedProducts();
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> searchProducts(@Param("query") String query);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.createdAt DESC")
    List<Product> findLatestProducts();
}
