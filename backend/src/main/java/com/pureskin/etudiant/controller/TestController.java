package com.pureskin.etudiant.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class TestController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Backend is running");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/routines-simple")
    public ResponseEntity<Map<String, Object>> getRoutinesSimple() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("data", java.util.Arrays.asList(
            Map.of(
                "id", 1L,
                "name", "Routine Express Matin",
                "slug", "routine-express-matin",
                "description", "Parfaite pour les matins pressés",
                "isRecommended", true,
                "durationMinutes", 5,
                "difficultyLevel", "Débutant"
            ),
            Map.of(
                "id", 2L,
                "name", "Routine Soir Détente",
                "slug", "routine-soir-detente",
                "description", "Routine relaxante après une longue journée",
                "isRecommended", true,
                "durationMinutes", 3,
                "difficultyLevel", "Débutant"
            )
        ));
        return ResponseEntity.ok(response);
    }
}
