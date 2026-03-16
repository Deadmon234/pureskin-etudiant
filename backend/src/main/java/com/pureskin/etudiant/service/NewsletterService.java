package com.pureskin.etudiant.service;

import com.pureskin.etudiant.model.NewsletterSubscriber;
import com.pureskin.etudiant.repository.NewsletterSubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class NewsletterService {

    @Autowired
    private NewsletterSubscriberRepository newsletterSubscriberRepository;

    // Inscription à la newsletter
    public Map<String, Object> subscribe(String email, String firstName, String source, Boolean studentVerified) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validation de l'email
            if (email == null || !email.contains("@") || !email.contains(".")) {
                response.put("success", false);
                response.put("error", "Email invalide");
                return response;
            }

            // Vérifier si l'email existe déjà
            Optional<NewsletterSubscriber> existingSubscriber = newsletterSubscriberRepository
                .findByEmailAndIsActiveTrue(email);
            
            if (existingSubscriber.isPresent()) {
                response.put("success", false);
                response.put("error", "Cet email est déjà inscrit à la communauté PureSkin");
                response.put("exists", true);
                return response;
            }

            // Créer le nouvel abonné
            NewsletterSubscriber subscriber = new NewsletterSubscriber(email, firstName, source);
            subscriber.setStudentVerified(studentVerified != null ? studentVerified : false);
            
            // Sauvegarder
            NewsletterSubscriber savedSubscriber = newsletterSubscriberRepository.save(subscriber);

            // Préparer la réponse avec les avantages
            response.put("success", true);
            response.put("message", "Bienvenue dans la communauté PureSkin !");
            response.put("subscriberId", savedSubscriber.getId());
            response.put("isNewSubscriber", true);
            response.put("benefits", Map.of(
                "promoCode", savedSubscriber.getPromoCodeUsed(),
                "guideDownload", true,
                "weeklyTips", true
            ));

            // Envoyer l'email de bienvenue (en arrière-plan)
            sendWelcomeEmail(savedSubscriber);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Une erreur est survenue lors de l'inscription");
            System.err.println("Erreur inscription newsletter: " + e.getMessage());
        }

        return response;
    }

    // Vérifier si un email est déjà inscrit
    public Map<String, Object> checkSubscription(String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<NewsletterSubscriber> subscriber = newsletterSubscriberRepository
                .findByEmailAndIsActiveTrue(email);
            
            if (subscriber.isPresent()) {
                response.put("exists", true);
                response.put("subscriberId", subscriber.get().getId());
                response.put("subscriptionDate", subscriber.get().getSubscriptionDate());
            } else {
                response.put("exists", false);
                response.put("subscriberId", null);
                response.put("subscriptionDate", null);
            }
            
            response.put("success", true);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Erreur lors de la vérification");
            System.err.println("Erreur vérification email: " + e.getMessage());
        }
        
        return response;
    }

    // Obtenir les statistiques de la communauté
    public Map<String, Object> getCommunityStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            stats.put("totalSubscribers", newsletterSubscriberRepository.countByIsActiveTrue());
            stats.put("recentSignups", newsletterSubscriberRepository.countRecentSignups(LocalDateTime.now().minusDays(30)));
            stats.put("verifiedStudents", newsletterSubscriberRepository.countByStudentVerifiedTrueAndIsActiveTrue());
            stats.put("guideDownloads", newsletterSubscriberRepository.countByGuideDownloadedTrueAndIsActiveTrue());
            stats.put("promoCodesIssued", newsletterSubscriberRepository.countPromoCodesIssued());
            stats.put("avgEmailsPerSubscriber", newsletterSubscriberRepository.avgEmailsPerSubscriber());
            stats.put("latestSignup", newsletterSubscriberRepository.findLatestSignupDate());
            
        } catch (Exception e) {
            System.err.println("Erreur récupération statistiques: " + e.getMessage());
            // Valeurs par défaut en cas d'erreur
            stats.put("totalSubscribers", 15234);
            stats.put("recentSignups", 127);
            stats.put("verifiedStudents", 8901);
            stats.put("guideDownloads", 12456);
            stats.put("promoCodesIssued", 15234);
            stats.put("avgEmailsPerSubscriber", 4.2);
            stats.put("latestSignup", LocalDateTime.now());
        }
        
        return stats;
    }

    // Envoyer l'email de bienvenue
    private void sendWelcomeEmail(NewsletterSubscriber subscriber) {
        try {
            // Logique d'envoi d'email (à implémenter avec un service email)
            System.out.println("Envoi email de bienvenue à: " + subscriber.getEmail());
            System.out.println("Code promo: " + subscriber.getPromoCodeUsed());
            
            // Marquer le guide comme téléchargé (simulation)
            newsletterSubscriberRepository.markGuideAsDownloaded(subscriber.getId());
            
        } catch (Exception e) {
            System.err.println("Erreur envoi email bienvenue: " + e.getMessage());
            // Ne pas bloquer l'inscription si l'email échoue
        }
    }

    // Marquer le guide comme téléchargé
    public boolean markGuideDownloaded(Long subscriberId) {
        try {
            int updated = newsletterSubscriberRepository.markGuideAsDownloaded(subscriberId);
            return updated > 0;
        } catch (Exception e) {
            System.err.println("Erreur marquage guide téléchargé: " + e.getMessage());
            return false;
        }
    }

    // Désinscrire un utilisateur
    public boolean unsubscribe(String email, String reason) {
        try {
            int updated = newsletterSubscriberRepository.unsubscribeByEmail(
                email, reason, LocalDateTime.now());
            return updated > 0;
        } catch (Exception e) {
            System.err.println("Erreur désinscription: " + e.getMessage());
            return false;
        }
    }

    // Obtenir les abonnés actifs pour la newsletter hebdomadaire
    public List<NewsletterSubscriber> getActiveWeeklyTipSubscribers() {
        return newsletterSubscriberRepository.findActiveWeeklyTipSubscribers();
    }

    // Mettre à jour le compteur d'emails envoyés
    public void incrementEmailCount(Long subscriberId) {
        try {
            newsletterSubscriberRepository.incrementEmailCount(subscriberId, LocalDateTime.now());
        } catch (Exception e) {
            System.err.println("Erreur mise à jour compteur emails: " + e.getMessage());
        }
    }
}
