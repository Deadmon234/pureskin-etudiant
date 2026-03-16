package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.model.Testimonial;
import com.pureskin.etudiant.repository.TestimonialRepository;
import com.pureskin.etudiant.service.TestimonialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/testimonials")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class AdminTestimonialController {
    
    @Autowired
    private TestimonialService testimonialService;
    
    @Autowired
    private TestimonialRepository testimonialRepository;
    
    // Obtenir tous les témoignages avec pagination
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTestimonials(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) Boolean approved) {
        try {
            System.out.println("=== RÉCUPÉRATION TÉMOIGNAGES ADMIN ===");
            System.out.println("Page: " + page + ", Limit: " + limit + ", Approved: " + approved);
            
            // Créer un pageable avec tri par date décroissante
            Pageable pageable = PageRequest.of(page, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
            
            Page<Testimonial> testimonialsPage;
            if (approved != null) {
                testimonialsPage = testimonialRepository.findByIsApprovedOrderByCreatedAtDesc(approved, pageable);
            } else {
                testimonialsPage = testimonialService.findAll(pageable);
            }
            
            // Convertir les témoignages en format de réponse
            List<Map<String, Object>> testimonialsData = testimonialsPage.getContent().stream()
                .map(testimonial -> {
                    Map<String, Object> testimonialData = new HashMap<>();
                    testimonialData.put("id", testimonial.getId());
                    testimonialData.put("customerName", testimonial.getCustomerName());
                    testimonialData.put("customerEmail", testimonial.getCustomerEmail());
                    testimonialData.put("rating", testimonial.getRating());
                    testimonialData.put("comment", testimonial.getComment());
                    testimonialData.put("productName", testimonial.getProductName());
                    testimonialData.put("isApproved", testimonial.getIsApproved());
                    testimonialData.put("createdAt", testimonial.getCreatedAt());
                    testimonialData.put("updatedAt", testimonial.getUpdatedAt());
                    return testimonialData;
                })
                .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("testimonials", testimonialsData);
            response.put("currentPage", testimonialsPage.getNumber());
            response.put("totalPages", testimonialsPage.getTotalPages());
            response.put("totalItems", testimonialsPage.getTotalElements());
            response.put("hasNext", testimonialsPage.hasNext());
            response.put("hasPrevious", testimonialsPage.hasPrevious());
            
            System.out.println("=== TÉMOIGNAGES ADMIN RÉCUPÉRÉS: " + testimonialsData.size() + " ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("=== ERREUR RÉCUPÉRATION TÉMOIGNAGES ADMIN ===");
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de la récupération des témoignages: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // Obtenir les témoignages récents (limité)
    @GetMapping("/recent")
    public ResponseEntity<Map<String, Object>> getRecentTestimonials(
            @RequestParam(defaultValue = "5") int limit) {
        try {
            System.out.println("=== RÉCUPÉRATION TÉMOIGNAGES RÉCENTS ===");
            
            Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
            Page<Testimonial> testimonialsPage = testimonialService.findAll(pageable);
            
            List<Map<String, Object>> testimonialsData = testimonialsPage.getContent().stream()
                .map(testimonial -> {
                    Map<String, Object> testimonialData = new HashMap<>();
                    testimonialData.put("id", testimonial.getId());
                    testimonialData.put("customerName", testimonial.getCustomerName());
                    testimonialData.put("rating", testimonial.getRating());
                    testimonialData.put("comment", testimonial.getComment());
                    testimonialData.put("productName", testimonial.getProductName());
                    testimonialData.put("isApproved", testimonial.getIsApproved());
                    testimonialData.put("date", testimonial.getCreatedAt());
                    return testimonialData;
                })
                .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("testimonials", testimonialsData);
            
            System.out.println("=== TÉMOIGNAGES RÉCENTS RÉCUPÉRÉS: " + testimonialsData.size() + " ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("=== ERREUR TÉMOIGNAGES RÉCENTS ===");
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de la récupération des témoignages récents: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // Approuver un témoignage
    @PutMapping("/{testimonialId}/approve")
    public ResponseEntity<Map<String, Object>> approveTestimonial(@PathVariable Long testimonialId) {
        try {
            System.out.println("=== APPROBATION TÉMOIGNAGE: " + testimonialId + " ===");
            
            Optional<Testimonial> testimonialOpt = testimonialService.findById(testimonialId);
            if (!testimonialOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Témoignage non trouvé");
                return ResponseEntity.notFound().build();
            }
            
            Testimonial testimonial = testimonialOpt.get();
            testimonial.setIsApproved(true);
            testimonialService.saveTestimonial(testimonial);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Témoignage approuvé avec succès");
            response.put("testimonialId", testimonialId);
            
            System.out.println("=== TÉMOIGNAGE APPROUVÉ AVEC SUCCÈS ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("=== ERREUR APPROBATION TÉMOIGNAGE ===");
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de l'approbation du témoignage: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // Rejeter un témoignage
    @PutMapping("/{testimonialId}/reject")
    public ResponseEntity<Map<String, Object>> rejectTestimonial(@PathVariable Long testimonialId) {
        try {
            System.out.println("=== REJET TÉMOIGNAGE: " + testimonialId + " ===");
            
            Optional<Testimonial> testimonialOpt = testimonialService.findById(testimonialId);
            if (!testimonialOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Témoignage non trouvé");
                return ResponseEntity.notFound().build();
            }
            
            Testimonial testimonial = testimonialOpt.get();
            testimonial.setIsApproved(false);
            testimonialService.saveTestimonial(testimonial);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Témoignage rejeté avec succès");
            response.put("testimonialId", testimonialId);
            
            System.out.println("=== TÉMOIGNAGE REJETÉ AVEC SUCCÈS ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("=== ERREUR REJET TÉMOIGNAGE ===");
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors du rejet du témoignage: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // Supprimer un témoignage
    @DeleteMapping("/{testimonialId}")
    public ResponseEntity<Map<String, Object>> deleteTestimonial(@PathVariable Long testimonialId) {
        try {
            System.out.println("=== SUPPRESSION TÉMOIGNAGE: " + testimonialId + " ===");
            
            Optional<Testimonial> testimonialOpt = testimonialService.findById(testimonialId);
            if (!testimonialOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Témoignage non trouvé");
                return ResponseEntity.notFound().build();
            }
            
            testimonialService.deleteTestimonial(testimonialId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Témoignage supprimé avec succès");
            response.put("testimonialId", testimonialId);
            
            System.out.println("=== TÉMOIGNAGE SUPPRIMÉ AVEC SUCCÈS ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("=== ERREUR SUPPRESSION TÉMOIGNAGE ===");
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de la suppression du témoignage: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
