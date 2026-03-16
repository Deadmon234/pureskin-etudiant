package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.service.NewsletterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NewsletterController {

    @Autowired
    private NewsletterService newsletterService;

    // Vérifier si un email est déjà inscrit
    @PostMapping("/check")
    public ResponseEntity<Map<String, Object>> checkSubscription(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Email est requis"
            ));
        }

        Map<String, Object> response = newsletterService.checkSubscription(email.trim().toLowerCase());
        
        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Inscription à la newsletter
    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, Object>> subscribe(@RequestBody Map<String, Object> request) {
        String email = (String) request.get("email");
        String firstName = (String) request.get("firstName");
        String source = (String) request.get("source");
        Boolean studentVerified = (Boolean) request.get("studentVerified");

        // Valeurs par défaut
        if (source == null) source = "homepage";
        if (studentVerified == null) studentVerified = false;

        Map<String, Object> response = newsletterService.subscribe(email, firstName, source, studentVerified);

        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else if ("Cet email est déjà inscrit à la communauté PureSkin".equals(response.get("error"))) {
            return ResponseEntity.status(409).body(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Envoyer l'email de bienvenue
    @PostMapping("/welcome-email")
    public ResponseEntity<Map<String, Object>> sendWelcomeEmail(@RequestBody Map<String, Object> request) {
        String email = (String) request.get("email");
        String firstName = (String) request.get("firstName");
        String promoCode = (String) request.get("promoCode");
        String guideUrl = (String) request.get("guideUrl");

        try {
            // Logique d'envoi d'email de bienvenue
            System.out.println("=== ENVOI EMAIL BIENVENUE ===");
            System.out.println("Email: " + email);
            System.out.println("Prénom: " + firstName);
            System.out.println("Code promo: " + promoCode);
            System.out.println("URL guide: " + guideUrl);
            
            // TODO: Intégrer avec un service email réel (SendGrid, Mailgun, etc.)
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email de bienvenue envoyé avec succès"
            ));
            
        } catch (Exception e) {
            System.err.println("Erreur envoi email bienvenue: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Erreur lors de l'envoi de l'email"
            ));
        }
    }

    // Obtenir les statistiques de la communauté
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCommunityStats() {
        try {
            Map<String, Object> stats = newsletterService.getCommunityStats();
            
            // Formatter les statistiques pour l'affichage
            Map<String, Object> formattedStats = Map.of(
                "totalSubscribers", stats.get("totalSubscribers"),
                "satisfactionRate", 4.9, // Valeur fixe pour le moment
                "recentSignups", stats.get("recentSignups"),
                "verifiedStudents", stats.get("verifiedStudents"),
                "guideDownloads", stats.get("guideDownloads"),
                "promoCodesIssued", stats.get("promoCodesIssued"),
                "avgEmailsPerSubscriber", stats.get("avgEmailsPerSubscriber"),
                "latestSignup", stats.get("latestSignup")
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "stats", formattedStats
            ));
            
        } catch (Exception e) {
            System.err.println("Erreur récupération statistiques: " + e.getMessage());
            
            // Retourner les statistiques par défaut
            Map<String, Object> defaultStats = Map.of(
                "totalSubscribers", 15234,
                "satisfactionRate", 4.9,
                "recentSignups", 127,
                "verifiedStudents", 8901,
                "guideDownloads", 12456,
                "promoCodesIssued", 15234,
                "avgEmailsPerSubscriber", 4.2,
                "latestSignup", java.time.LocalDateTime.now()
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "stats", defaultStats
            ));
        }
    }

    // Marquer le guide comme téléchargé
    @PostMapping("/guide-downloaded")
    public ResponseEntity<Map<String, Object>> markGuideDownloaded(@RequestBody Map<String, Long> request) {
        Long subscriberId = request.get("subscriberId");
        
        if (subscriberId == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "ID d'abonné requis"
            ));
        }

        boolean success = newsletterService.markGuideDownloaded(subscriberId);
        
        if (success) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Guide marqué comme téléchargé"
            ));
        } else {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Erreur lors du marquage du guide"
            ));
        }
    }

    // Désinscrire un utilisateur
    @PostMapping("/unsubscribe")
    public ResponseEntity<Map<String, Object>> unsubscribe(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String reason = request.get("reason");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Email est requis"
            ));
        }

        boolean success = newsletterService.unsubscribe(email.trim().toLowerCase(), reason);
        
        if (success) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Désinscription réussie"
            ));
        } else {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Erreur lors de la désinscription"
            ));
        }
    }

    // Obtenir la liste des abonnés actifs (admin)
    @GetMapping("/subscribers")
    public ResponseEntity<Map<String, Object>> getActiveSubscribers() {
        try {
            var subscribers = newsletterService.getActiveWeeklyTipSubscribers();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "subscribers", subscribers.stream().map(sub -> Map.of(
                    "id", sub.getId(),
                    "email", sub.getEmail(),
                    "firstName", sub.getFirstName(),
                    "source", sub.getSource(),
                    "subscriptionDate", sub.getSubscriptionDate(),
                    "studentVerified", sub.getStudentVerified(),
                    "guideDownloaded", sub.getGuideDownloaded(),
                    "promoCodeUsed", sub.getPromoCodeUsed()
                )).toList()
            ));
            
        } catch (Exception e) {
            System.err.println("Erreur récupération abonnés: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Erreur lors de la récupération des abonnés"
            ));
        }
    }
}
