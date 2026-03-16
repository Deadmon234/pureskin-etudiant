package com.pureskin.etudiant.repository;

import com.pureskin.etudiant.model.DeliveryOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryOptionRepository extends JpaRepository<DeliveryOption, Long> {
    
    List<DeliveryOption> findByIsActiveOrderBySortOrderAsc(Boolean isActive);
    
    List<DeliveryOption> findByIsActiveOrderByIsExpressDescSortOrderAsc(Boolean isActive);
    
    Optional<DeliveryOption> findByIsDefaultTrueAndIsActive(Boolean isActive);
    
    @Query("SELECT d FROM DeliveryOption d WHERE d.isActive = true ORDER BY d.price ASC")
    List<DeliveryOption> findActiveOptionsByPriceAsc();
    
    @Query("SELECT d FROM DeliveryOption d WHERE d.isActive = true ORDER BY d.deliveryTimeMin ASC")
    List<DeliveryOption> findActiveOptionsByDeliveryTimeAsc();
    
    @Query("SELECT d FROM DeliveryOption d WHERE d.isActive = true AND d.isExpress = true")
    List<DeliveryOption> findExpressOptions();
}
