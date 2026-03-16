package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.model.Testimonial;
import com.pureskin.etudiant.repository.TestimonialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class ReviewController {
    
    @Autowired
    private TestimonialRepository testimonialRepository;
    
    @GetMapping
    public Page<Testimonial> getApprovedReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String product) {
        Pageable pageable = PageRequest.of(page, size);
        
        // Filtrage par note et produit si spécifiés
        if (rating != null && product != null) {
            return testimonialRepository.findByIsApprovedAndRatingAndProductNameContainingIgnoreCase(
                true, rating, product, pageable);
        } else if (rating != null) {
            return testimonialRepository.findByIsApprovedAndRating(true, rating, pageable);
        } else if (product != null) {
            return testimonialRepository.findByIsApprovedAndProductNameContainingIgnoreCase(
                true, product, pageable);
        } else {
            return testimonialRepository.findByIsApprovedOrderByCreatedAtDesc(true, pageable);
        }
    }
    
    @GetMapping("/all")
    public List<Testimonial> getAllApprovedReviews() {
        return testimonialRepository.findByIsApprovedOrderByCreatedAtDesc(true);
    }
    
    @GetMapping("/product/{productName}")
    public Page<Testimonial> getReviewsByProduct(
            @PathVariable String productName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return testimonialRepository.findByIsApprovedAndProductNameContainingIgnoreCase(
            true, productName, pageable);
    }
    
    @GetMapping("/rating/{rating}")
    public Page<Testimonial> getReviewsByRating(
            @PathVariable Integer rating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return testimonialRepository.findByIsApprovedAndRating(true, rating, pageable);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getReviewStats() {
        long totalReviews = testimonialRepository.countApprovedTestimonials();
        Double averageRating = testimonialRepository.getAverageRating();
        
        // Distribution des notes
        Map<String, Long> ratingDistribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            long count = testimonialRepository.countByRating(i);
            ratingDistribution.put("rating_" + i, count);
        }
        
        // Produits les plus notés
        List<Map<String, Object>> topProducts = testimonialRepository.getTopRatedProducts();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReviews", totalReviews);
        stats.put("averageRating", averageRating != null ? averageRating : 0.0);
        stats.put("ratingDistribution", ratingDistribution);
        stats.put("topProducts", topProducts);
        stats.put("recommendationRate", 95); // Mock data
        
        return ResponseEntity.ok(stats);
    }
    
    @PostMapping
    public ResponseEntity<Testimonial> createReview(@RequestBody Testimonial testimonial) {
        testimonial.setIsApproved(false); // Requires approval
        Testimonial savedReview = testimonialRepository.save(testimonial);
        return ResponseEntity.ok(savedReview);
    }
    
    @PutMapping("/{id}/helpful")
    public ResponseEntity<Testimonial> markAsHelpful(@PathVariable Long id) {
        return testimonialRepository.findById(id)
            .map(testimonial -> {
                testimonial.setHelpfulCount(testimonial.getHelpfulCount() + 1);
                return ResponseEntity.ok(testimonialRepository.save(testimonial));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
