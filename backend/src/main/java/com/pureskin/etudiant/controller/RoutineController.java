package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.model.Routine;
import com.pureskin.etudiant.repository.RoutineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/routines")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class RoutineController {
    
    @Autowired
    private RoutineRepository routineRepository;
    
    @GetMapping
    public List<Routine> getAllRoutines() {
        return routineRepository.findAllOrderByCreatedAtDesc();
    }
    
    @GetMapping("/recommended")
    public List<Routine> getRecommendedRoutines() {
        return routineRepository.findByIsRecommendedOrderByCreatedAtDesc(true);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Routine> getRoutineById(@PathVariable Long id) {
        Optional<Routine> routine = routineRepository.findById(id);
        return routine.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/slug/{slug}")
    public ResponseEntity<Routine> getRoutineBySlug(@PathVariable String slug) {
        Routine routine = routineRepository.findBySlug(slug);
        if (routine != null) {
            return ResponseEntity.ok(routine);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/skin-type/{skinType}")
    public List<Routine> getRoutinesBySkinType(@PathVariable String skinType) {
        return routineRepository.findBySkinTypeOrderByCreatedAtDesc(skinType);
    }
    
    @GetMapping("/difficulty/{level}")
    public List<Routine> getRoutinesByDifficulty(@PathVariable String level) {
        return routineRepository.findByDifficultyLevelOrderByCreatedAtAsc(level);
    }
    
    @PostMapping
    public Routine createRoutine(@RequestBody Routine routine) {
        return routineRepository.save(routine);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Routine> updateRoutine(@PathVariable Long id, @RequestBody Routine routineDetails) {
        Optional<Routine> routine = routineRepository.findById(id);
        if (routine.isPresent()) {
            Routine existingRoutine = routine.get();
            existingRoutine.setName(routineDetails.getName());
            existingRoutine.setSlug(routineDetails.getSlug());
            existingRoutine.setDescription(routineDetails.getDescription());
            existingRoutine.setImage(routineDetails.getImage());
            existingRoutine.setSkinType(routineDetails.getSkinType());
            existingRoutine.setSkinConcerns(routineDetails.getSkinConcerns());
            existingRoutine.setSteps(routineDetails.getSteps());
            existingRoutine.setDurationMinutes(routineDetails.getDurationMinutes());
            existingRoutine.setDifficultyLevel(routineDetails.getDifficultyLevel());
            existingRoutine.setProductsNeeded(routineDetails.getProductsNeeded());
            existingRoutine.setIsRecommended(routineDetails.getIsRecommended());
            existingRoutine.setViewCount(routineDetails.getViewCount());
            return ResponseEntity.ok(routineRepository.save(existingRoutine));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoutine(@PathVariable Long id) {
        Optional<Routine> routine = routineRepository.findById(id);
        if (routine.isPresent()) {
            routineRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
