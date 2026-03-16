package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.model.User;
import com.pureskin.etudiant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class AdminDebugController {

    @Autowired
    private UserService userService;

    @PostMapping("/users/check")
    public ResponseEntity<Map<String, Object>> checkUser(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            System.out.println("=== DEBUG: Recherche utilisateur ===");
            System.out.println("Username/Email: " + username);

            User user = userService.findByEmailOrUsername(username).orElse(null);
            
            Map<String, Object> response = new HashMap<>();
            
            if (user == null) {
                response.put("success", false);
                response.put("message", "Utilisateur non trouvé");
                response.put("username", username);
            } else {
                response.put("success", true);
                response.put("message", "Utilisateur trouvé");
                response.put("user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole(),
                    "isActive", user.isActive(),
                    "firstName", user.getFirstName(),
                    "lastName", user.getLastName()
                ));
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ ERREUR DEBUG: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
