package com.pureskin.etudiant.repository;

import com.pureskin.etudiant.model.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FAQRepository extends JpaRepository<FAQ, Long> {
    
    List<FAQ> findByIsActiveOrderByCategoryAscSortOrderAsc(Boolean isActive);
    
    List<FAQ> findByIsActiveAndCategoryOrderBySortOrderAsc(Boolean isActive, String category);
    
    @Query("SELECT f FROM FAQ f WHERE f.isActive = true AND (LOWER(f.question) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(f.answer) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<FAQ> searchActiveFAQs(@Param("query") String query);
    
    @Query("SELECT f FROM FAQ f WHERE f.isActive = true ORDER BY f.viewCount DESC")
    List<FAQ> findPopularFAQs();
    
    @Query("SELECT DISTINCT f.category FROM FAQ f WHERE f.isActive = true ORDER BY f.category ASC")
    List<String> findActiveCategories();
    
    @Query("SELECT COUNT(f) FROM FAQ f WHERE f.isActive = true AND f.category = :category")
    Long countByCategory(@Param("category") String category);
    
    @Query("SELECT f FROM FAQ f WHERE f.isActive = true ORDER BY f.helpfulCount DESC")
    List<FAQ> findMostHelpfulFAQs();
}
