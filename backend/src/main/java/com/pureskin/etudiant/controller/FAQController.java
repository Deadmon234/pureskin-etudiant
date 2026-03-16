package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.model.FAQ;
import com.pureskin.etudiant.repository.FAQRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/faq")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class FAQController {
    
    @Autowired
    private FAQRepository faqRepository;
    
    @GetMapping
    public List<FAQ> getActiveFAQs() {
        return faqRepository.findByIsActiveOrderByCategoryAscSortOrderAsc(true);
    }
    
    @GetMapping("/category/{category}")
    public List<FAQ> getFAQsByCategory(@PathVariable String category) {
        return faqRepository.findByIsActiveAndCategoryOrderBySortOrderAsc(true, category);
    }
    
    @GetMapping("/search")
    public List<FAQ> searchFAQs(@RequestParam String q) {
        return faqRepository.searchActiveFAQs(q);
    }
    
    @GetMapping("/categories")
    public List<String> getCategories() {
        return faqRepository.findActiveCategories();
    }
    
    @GetMapping("/popular")
    public List<FAQ> getPopularFAQs() {
        return faqRepository.findPopularFAQs().stream().limit(10).toList();
    }
    
    @GetMapping("/helpful")
    public List<FAQ> getMostHelpfulFAQs() {
        return faqRepository.findMostHelpfulFAQs().stream().limit(10).toList();
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getFAQStats() {
        List<String> categories = faqRepository.findActiveCategories();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCategories", categories.size());
        stats.put("categories", categories);
        
        // Count FAQs per category
        Map<String, Long> categoryCounts = new HashMap<>();
        for (String category : categories) {
            Long count = faqRepository.countByCategory(category);
            categoryCounts.put(category, count);
        }
        stats.put("categoryCounts", categoryCounts);
        
        // Total FAQs
        long totalFAQs = categoryCounts.values().stream().mapToLong(Long::longValue).sum();
        stats.put("totalFAQs", totalFAQs);
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FAQ> getFAQById(@PathVariable Long id) {
        return faqRepository.findById(id)
            .map(faq -> {
                // Increment view count
                faq.setViewCount(faq.getViewCount() + 1);
                faqRepository.save(faq);
                return ResponseEntity.ok(faq);
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public FAQ createFAQ(@RequestBody FAQ faq) {
        return faqRepository.save(faq);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<FAQ> updateFAQ(@PathVariable Long id, @RequestBody FAQ faqDetails) {
        return faqRepository.findById(id)
            .map(faq -> {
                faq.setQuestion(faqDetails.getQuestion());
                faq.setAnswer(faqDetails.getAnswer());
                faq.setCategory(faqDetails.getCategory());
                faq.setSubcategory(faqDetails.getSubcategory());
                faq.setIsActive(faqDetails.getIsActive());
                faq.setSortOrder(faqDetails.getSortOrder());
                return ResponseEntity.ok(faqRepository.save(faq));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/helpful")
    public ResponseEntity<FAQ> markAsHelpful(@PathVariable Long id) {
        return faqRepository.findById(id)
            .map(faq -> {
                faq.setHelpfulCount(faq.getHelpfulCount() + 1);
                return ResponseEntity.ok(faqRepository.save(faq));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFAQ(@PathVariable Long id) {
        return faqRepository.findById(id)
            .map(faq -> {
                faq.setIsActive(false);
                faqRepository.save(faq);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
