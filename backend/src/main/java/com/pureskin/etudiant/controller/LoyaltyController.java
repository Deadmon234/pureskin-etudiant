package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.model.LoyaltyProgram;
import com.pureskin.etudiant.repository.LoyaltyProgramRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loyalty")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class LoyaltyController {
    
    @Autowired
    private LoyaltyProgramRepository loyaltyProgramRepository;
    
    @GetMapping("/programs")
    public List<LoyaltyProgram> getActivePrograms() {
        return loyaltyProgramRepository.findByIsActiveOrderByMinPointsAsc(true);
    }
    
    @GetMapping("/programs/for-points/{points}")
    public List<LoyaltyProgram> getProgramsForPoints(@PathVariable Integer points) {
        return loyaltyProgramRepository.findProgramsForPoints(points);
    }
    
    @GetMapping("/current/{points}")
    public ResponseEntity<?> getCurrentLevel(@PathVariable Integer points) {
        LoyaltyProgram currentLevel = loyaltyProgramRepository
            .findProgramsForPoints(points)
            .stream()
            .findFirst()
            .orElse(null);
        
        if (currentLevel != null) {
            // Find next level
            List<LoyaltyProgram> allPrograms = loyaltyProgramRepository.findByIsActiveOrderByMinPointsAsc(true);
            LoyaltyProgram nextLevel = null;
            
            for (int i = 0; i < allPrograms.size(); i++) {
                if (allPrograms.get(i).getId().equals(currentLevel.getId()) && i + 1 < allPrograms.size()) {
                    nextLevel = allPrograms.get(i + 1);
                    break;
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("currentLevel", currentLevel);
            response.put("nextLevel", nextLevel);
            response.put("userPoints", points);
            
            if (nextLevel != null) {
                int pointsToNext = nextLevel.getMinPoints() - points;
                response.put("pointsToNext", pointsToNext);
                
                // Calculate progress percentage
                int currentMin = currentLevel.getMinPoints() != null ? currentLevel.getMinPoints() : 0;
                int nextMin = nextLevel.getMinPoints();
                double progress = ((double)(points - currentMin) / (nextMin - currentMin)) * 100;
                response.put("progressToNext", Math.min(100, Math.max(0, progress)));
            } else {
                response.put("progressToNext", 100);
            }
            
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getLoyaltyStats() {
        List<LoyaltyProgram> programs = loyaltyProgramRepository.findByIsActiveOrderByMinPointsAsc(true);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalLevels", programs.size());
        stats.put("programs", programs);
        stats.put("maxMultiplier", programs.stream()
            .mapToDouble(LoyaltyProgram::getPointsMultiplier)
            .max()
            .orElse(1.0));
        stats.put("maxDiscount", programs.stream()
            .mapToDouble(LoyaltyProgram::getDiscountPercentage)
            .max()
            .orElse(0.0));
        
        return ResponseEntity.ok(stats);
    }
    
    @PostMapping("/programs")
    public LoyaltyProgram createProgram(@RequestBody LoyaltyProgram program) {
        return loyaltyProgramRepository.save(program);
    }
    
    @PutMapping("/programs/{id}")
    public ResponseEntity<LoyaltyProgram> updateProgram(@PathVariable Long id, @RequestBody LoyaltyProgram programDetails) {
        return loyaltyProgramRepository.findById(id)
            .map(program -> {
                program.setName(programDetails.getName());
                program.setDescription(programDetails.getDescription());
                program.setPointsMultiplier(programDetails.getPointsMultiplier());
                program.setDiscountPercentage(programDetails.getDiscountPercentage());
                program.setMinPoints(programDetails.getMinPoints());
                program.setMaxPoints(programDetails.getMaxPoints());
                program.setBenefits(programDetails.getBenefits());
                program.setNextReward(programDetails.getNextReward());
                program.setIsActive(programDetails.getIsActive());
                program.setSortOrder(programDetails.getSortOrder());
                return ResponseEntity.ok(loyaltyProgramRepository.save(program));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/programs/{id}")
    public ResponseEntity<Void> deleteProgram(@PathVariable Long id) {
        return loyaltyProgramRepository.findById(id)
            .map(program -> {
                program.setIsActive(false);
                loyaltyProgramRepository.save(program);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
