package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.model.DeliveryOption;
import com.pureskin.etudiant.repository.DeliveryOptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/delivery")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class DeliveryController {
    
    @Autowired
    private DeliveryOptionRepository deliveryOptionRepository;
    
    @GetMapping("/options")
    public List<DeliveryOption> getActiveDeliveryOptions() {
        return deliveryOptionRepository.findByIsActiveOrderBySortOrderAsc(true);
    }
    
    @GetMapping("/options/by-price")
    public List<DeliveryOption> getOptionsByPrice() {
        return deliveryOptionRepository.findActiveOptionsByPriceAsc();
    }
    
    @GetMapping("/options/by-time")
    public List<DeliveryOption> getOptionsByDeliveryTime() {
        return deliveryOptionRepository.findActiveOptionsByDeliveryTimeAsc();
    }
    
    @GetMapping("/options/express")
    public List<DeliveryOption> getExpressOptions() {
        return deliveryOptionRepository.findExpressOptions();
    }
    
    @GetMapping("/options/default")
    public ResponseEntity<DeliveryOption> getDefaultOption() {
        return deliveryOptionRepository.findByIsDefaultTrueAndIsActive(true)
            .map(option -> ResponseEntity.ok(option))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getDeliveryStats() {
        List<DeliveryOption> options = deliveryOptionRepository.findByIsActiveOrderBySortOrderAsc(true);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOptions", options.size());
        stats.put("options", options);
        stats.put("expressOptions", options.stream().filter(DeliveryOption::getIsExpress).count());
        stats.put("averagePrice", options.stream().mapToDouble(DeliveryOption::getPrice).average().orElse(0.0));
        stats.put("minPrice", options.stream().mapToDouble(DeliveryOption::getPrice).min().orElse(0.0));
        stats.put("maxPrice", options.stream().mapToDouble(DeliveryOption::getPrice).max().orElse(0.0));
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/options/{id}")
    public ResponseEntity<DeliveryOption> getDeliveryOptionById(@PathVariable Long id) {
        return deliveryOptionRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/options")
    public DeliveryOption createDeliveryOption(@RequestBody DeliveryOption option) {
        return deliveryOptionRepository.save(option);
    }
    
    @PutMapping("/options/{id}")
    public ResponseEntity<DeliveryOption> updateDeliveryOption(@PathVariable Long id, @RequestBody DeliveryOption optionDetails) {
        return deliveryOptionRepository.findById(id)
            .map(option -> {
                option.setName(optionDetails.getName());
                option.setDescription(optionDetails.getDescription());
                option.setPrice(optionDetails.getPrice());
                option.setDeliveryTimeMin(optionDetails.getDeliveryTimeMin());
                option.setDeliveryTimeMax(optionDetails.getDeliveryTimeMax());
                option.setDeliveryTimeUnit(optionDetails.getDeliveryTimeUnit());
                option.setIsActive(optionDetails.getIsActive());
                option.setIsDefault(optionDetails.getIsDefault());
                option.setIsExpress(optionDetails.getIsExpress());
                option.setTrackingAvailable(optionDetails.getTrackingAvailable());
                option.setRestrictions(optionDetails.getRestrictions());
                option.setSortOrder(optionDetails.getSortOrder());
                return ResponseEntity.ok(deliveryOptionRepository.save(option));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/options/{id}")
    public ResponseEntity<Void> deleteDeliveryOption(@PathVariable Long id) {
        return deliveryOptionRepository.findById(id)
            .map(option -> {
                option.setIsActive(false);
                deliveryOptionRepository.save(option);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
