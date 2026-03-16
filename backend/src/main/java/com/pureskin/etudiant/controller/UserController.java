package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.model.User;
import com.pureskin.etudiant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // Authentification utilisateur (différente de l'auth admin)
    @PostMapping("/user/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody Map<String, String> loginRequest) {
        try {
            System.out.println("=== TENTATIVE CONNEXION ADMIN ===");
            System.out.println("Username: " + loginRequest.get("username"));
            
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");
            
            if (username == null || password == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Nom d'utilisateur et mot de passe requis");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Rechercher l'utilisateur
            Optional<User> userOpt = userService.findByUsername(username);
            
            if (!userOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Identifiants incorrects");
                return ResponseEntity.status(401).body(response);
            }
            
            User user = userOpt.get();
            
            // Vérifier si le compte est actif
            if (!user.getIsActive()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Compte désactivé");
                return ResponseEntity.status(401).body(response);
            }
            
            // Vérifier si c'est un administrateur
            if (!"admin".equals(user.getRole())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Accès non autorisé");
                return ResponseEntity.status(403).body(response);
            }
            
            // Vérifier le mot de passe
            if (!userService.checkPassword(password, user.getPasswordHash())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Identifiants incorrects");
                return ResponseEntity.status(401).body(response);
            }
            
            // Mettre à jour la dernière connexion
            userService.updateLastLogin(user.getId());
            
            // Créer la réponse utilisateur (sans mot de passe)
            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", user.getId());
            userResponse.put("username", user.getUsername());
            userResponse.put("email", user.getEmail());
            userResponse.put("firstName", user.getFirstName());
            userResponse.put("lastName", user.getLastName());
            userResponse.put("role", user.getRole());
            userResponse.put("lastLogin", user.getLastLogin());
            
            // Créer un token simple (en production, utiliser JWT)
            String token = "admin_token_" + user.getId() + "_" + System.currentTimeMillis();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Connexion réussie");
            response.put("token", token);
            response.put("user", userResponse);
            
            System.out.println("=== CONNEXION ADMIN RÉUSSIE ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("=== ERREUR CONNEXION ADMIN ===");
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur serveur");
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // Vérifier si l'admin est connecté
    @GetMapping("/auth/me")
    public ResponseEntity<Map<String, Object>> getCurrentAdmin(@RequestHeader("Authorization") String authorization) {
        try {
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Token manquant");
                return ResponseEntity.status(401).body(response);
            }
            
            String token = authorization.substring(7);
            
            // Validation simple du token (en production, utiliser JWT)
            if (!token.startsWith("admin_token_")) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Token invalide");
                return ResponseEntity.status(401).body(response);
            }
            
            // Extraire l'ID utilisateur du token
            String[] tokenParts = token.split("_");
            if (tokenParts.length < 3) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Token invalide");
                return ResponseEntity.status(401).body(response);
            }
            
            Long userId = Long.parseLong(tokenParts[2]);
            Optional<User> userOpt = userService.findById(userId);
            
            if (!userOpt.isPresent() || !"admin".equals(userOpt.get().getRole())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Utilisateur non trouvé ou non admin");
                return ResponseEntity.status(401).body(response);
            }
            
            User user = userOpt.get();
            
            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", user.getId());
            userResponse.put("username", user.getUsername());
            userResponse.put("email", user.getEmail());
            userResponse.put("firstName", user.getFirstName());
            userResponse.put("lastName", user.getLastName());
            userResponse.put("role", user.getRole());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", userResponse);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("=== ERREUR VÉRIFICATION ADMIN ===");
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur serveur");
            return ResponseEntity.status(500).body(response);
        }
    }
}
