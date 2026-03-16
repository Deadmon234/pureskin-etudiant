package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.model.Testimonial;
import com.pureskin.etudiant.repository.TestimonialRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/testimonials")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class TestimonialController {
    
    @Autowired
    private TestimonialRepository testimonialRepository;
    
    @GetMapping
    public List<Testimonial> getApprovedTestimonials() {
        return testimonialRepository.findByIsApprovedOrderByCreatedAtDesc(true);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Testimonial> getTestimonialById(@PathVariable Long id) {
        Optional<Testimonial> testimonial = testimonialRepository.findById(id);
        return testimonial.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/random")
    public List<Testimonial> getRandomTestimonials(@RequestParam(defaultValue = "6") int limit) {
        List<Testimonial> allTestimonials = testimonialRepository.findRandomApprovedTestimonials();
        return allTestimonials.stream().limit(limit).toList();
    }
    
    @GetMapping("/latest")
    public List<Testimonial> getLatestTestimonials(@RequestParam(defaultValue = "6") int limit) {
        List<Testimonial> allTestimonials = testimonialRepository.findLatestApprovedTestimonials();
        return allTestimonials.stream().limit(limit).toList();
    }
    
    @PostMapping
    public ResponseEntity<Testimonial> createTestimonial(@Valid @RequestBody Testimonial testimonial) {
        testimonial.setIsApproved(false); // Requires approval
        Testimonial savedTestimonial = testimonialRepository.save(testimonial);
        return ResponseEntity.ok(savedTestimonial);
    }
    
    @PutMapping("/{id}/approve")
    public ResponseEntity<Testimonial> approveTestimonial(@PathVariable Long id) {
        Optional<Testimonial> testimonial = testimonialRepository.findById(id);
        if (testimonial.isPresent()) {
            Testimonial existingTestimonial = testimonial.get();
            existingTestimonial.setIsApproved(true);
            return ResponseEntity.ok(testimonialRepository.save(existingTestimonial));
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getTestimonialStats() {
        long totalTestimonials = testimonialRepository.countApprovedTestimonials();
        Double averageRating = testimonialRepository.getAverageRating();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTestimonials", totalTestimonials);
        stats.put("averageRating", averageRating != null ? averageRating : 0.0);
        stats.put("recommendationRate", 95); // Mock data
        
        return ResponseEntity.ok(stats);
    }
}
