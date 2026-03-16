package com.pureskin.etudiant.repository;

import com.pureskin.etudiant.model.Testimonial;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {
    
    List<Testimonial> findByIsApproved(Boolean isApproved);
    
    List<Testimonial> findByIsApprovedOrderByCreatedAtDesc(Boolean isApproved);
    
    Page<Testimonial> findByIsApprovedOrderByCreatedAtDesc(Boolean isApproved, Pageable pageable);
    
    List<Testimonial> findByRating(Integer rating);
    
    List<Testimonial> findByProductName(String productName);
    
    @Query("SELECT COALESCE(AVG(t.rating), 0.0) FROM Testimonial t WHERE t.isApproved = true")
    Double calculateAverageRating();
    
    @Query("SELECT t FROM Testimonial t WHERE t.isApproved = true ORDER BY t.createdAt DESC")
    List<Testimonial> findRecentTestimonials();
    
    Page<Testimonial> findByIsApproved(Boolean isApproved, Pageable pageable);
    
    @Query("SELECT t FROM Testimonial t WHERE t.isApproved = true ORDER BY RANDOM()")
    List<Testimonial> findRandomApprovedTestimonials();
    
    @Query("SELECT COUNT(t) FROM Testimonial t WHERE t.isApproved = true")
    long countApprovedTestimonials();
    
    @Query("SELECT COALESCE(AVG(t.rating), 0.0) FROM Testimonial t WHERE t.isApproved = true")
    Double getAverageRating();
    
    @Query("SELECT t FROM Testimonial t WHERE t.isApproved = true ORDER BY t.createdAt DESC")
    List<Testimonial> findLatestApprovedTestimonials();
    
    // Nouvelles méthodes pour le filtrage
    Page<Testimonial> findByIsApprovedAndRating(Boolean isApproved, Integer rating, Pageable pageable);
    
    Page<Testimonial> findByIsApprovedAndProductNameContainingIgnoreCase(Boolean isApproved, String productName, Pageable pageable);
    
    Page<Testimonial> findByIsApprovedAndRatingAndProductNameContainingIgnoreCase(Boolean isApproved, Integer rating, String productName, Pageable pageable);
    
    @Query("SELECT COUNT(t) FROM Testimonial t WHERE t.isApproved = true AND t.rating = :rating")
    long countByRating(@Param("rating") Integer rating);
    
    @Query("SELECT new map(t.productName as productName, COUNT(t) as count, AVG(t.rating) as avgRating) FROM Testimonial t WHERE t.isApproved = true AND t.productName IS NOT NULL GROUP BY t.productName ORDER BY COUNT(t) DESC")
    List<Map<String, Object>> getTopRatedProducts();
}
