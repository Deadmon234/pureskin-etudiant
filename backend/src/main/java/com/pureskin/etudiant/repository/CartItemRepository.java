package com.pureskin.etudiant.repository;

import com.pureskin.etudiant.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    List<CartItem> findBySessionId(String sessionId);
    
    List<CartItem> findByCustomerId(Long customerId);
    
    Optional<CartItem> findBySessionIdAndProductId(String sessionId, Long productId);
    
    Optional<CartItem> findByCustomerIdAndProductId(Long customerId, Long productId);
    
    @Query("SELECT c FROM CartItem c WHERE c.sessionId = :sessionId OR c.customerId = :customerId")
    List<CartItem> findBySessionIdOrCustomerId(@Param("sessionId") String sessionId, @Param("customerId") Long customerId);
    
    void deleteBySessionId(String sessionId);
    
    void deleteByCustomerId(Long customerId);
}
