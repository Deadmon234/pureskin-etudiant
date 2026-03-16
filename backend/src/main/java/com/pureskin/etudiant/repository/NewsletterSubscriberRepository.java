package com.pureskin.etudiant.repository;

import com.pureskin.etudiant.model.NewsletterSubscriber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface NewsletterSubscriberRepository extends JpaRepository<NewsletterSubscriber, Long> {

    // Vérifier si un email existe déjà et est actif
    Optional<NewsletterSubscriber> findByEmailAndIsActiveTrue(String email);

    // Compter le nombre total d'abonnés actifs
    long countByIsActiveTrue();

    // Compter les inscriptions récentes (30 derniers jours)
    @Query("SELECT COUNT(n) FROM NewsletterSubscriber n WHERE n.isActive = true AND n.subscriptionDate >= :date")
    long countRecentSignups(@Param("date") LocalDateTime date);

    // Compter les étudiants vérifiés
    long countByStudentVerifiedTrueAndIsActiveTrue();

    // Compter les téléchargements de guide
    long countByGuideDownloadedTrueAndIsActiveTrue();

    // Compter les codes promo utilisés
    @Query("SELECT COUNT(n) FROM NewsletterSubscriber n WHERE n.isActive = true AND n.promoCodeUsed IS NOT NULL")
    long countPromoCodesIssued();

    // Moyenne des emails envoyés par abonné
    @Query("SELECT AVG(n.emailCount) FROM NewsletterSubscriber n WHERE n.isActive = true AND n.emailCount > 0")
    Double avgEmailsPerSubscriber();

    // Dernière inscription
    @Query("SELECT MAX(n.subscriptionDate) FROM NewsletterSubscriber n WHERE n.isActive = true")
    LocalDateTime findLatestSignupDate();

    // Liste des abonnés par source
    List<NewsletterSubscriber> findBySourceAndIsActiveTrue(String source);

    // Liste des abonnés pour newsletter hebdomadaire
    @Query("SELECT n FROM NewsletterSubscriber n WHERE n.isActive = true AND n.weeklyTipsActive = true")
    List<NewsletterSubscriber> findActiveWeeklyTipSubscribers();

    // Mettre à jour le compteur d'emails
    @Query("UPDATE NewsletterSubscriber n SET n.emailCount = n.emailCount + 1, n.lastEmailSent = :date WHERE n.id = :id")
    int incrementEmailCount(@Param("id") Long id, @Param("date") LocalDateTime date);

    // Marquer le guide comme téléchargé
    @Query("UPDATE NewsletterSubscriber n SET n.guideDownloaded = true WHERE n.id = :id")
    int markGuideAsDownloaded(@Param("id") Long id);

    // Désactiver un abonné (unsubscribe)
    @Query("UPDATE NewsletterSubscriber n SET n.isActive = false, n.unsubscribeReason = :reason, n.unsubscribeDate = :date WHERE n.email = :email")
    int unsubscribeByEmail(@Param("email") String email, @Param("reason") String reason, @Param("date") LocalDateTime date);
}
