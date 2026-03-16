package com.pureskin.etudiant.service;

import com.pureskin.etudiant.model.Payment;
import com.pureskin.etudiant.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@Service
@Transactional
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    // Créer un nouveau paiement
    public Payment createPayment(Payment payment) {
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }
    
    // Mettre à jour le statut d'un paiement
    public Payment updatePaymentStatus(String orderId, String status, String farotyTransactionId) {
        Optional<Payment> paymentOpt = paymentRepository.findByOrderId(orderId);
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            payment.setStatus(status);
            payment.setUpdatedAt(LocalDateTime.now());
            
            if (farotyTransactionId != null) {
                payment.setFarotyTransactionId(farotyTransactionId);
            }
            
            if ("SUCCESS".equals(status) || "FAILED".equals(status)) {
                payment.setProcessedAt(LocalDateTime.now());
            }
            
            return paymentRepository.save(payment);
        }
        throw new RuntimeException("Paiement non trouvé: " + orderId);
    }
    
    // Récupérer tous les paiements
    public List<Payment> getAllPayments() {
        return paymentRepository.findAllByOrderByCreatedAtDesc();
    }
    
    // Récupérer les paiements par statut
    public List<Payment> getPaymentsByStatus(String status) {
        return paymentRepository.findByStatusOrderByCreatedAtDesc(status);
    }
    
    // Récupérer un paiement par order ID
    public Optional<Payment> getPaymentByOrderId(String orderId) {
        return paymentRepository.findByOrderId(orderId);
    }
    
    // Récupérer les statistiques de paiements
    public Map<String, Object> getPaymentStats() {
        try {
            System.out.println("=== DÉBUT CALCUL STATISTIQUES PAIEMENTS ===");
            
            // Test de connexion à la base
            long totalPayments = paymentRepository.count();
            System.out.println("Nombre total de paiements dans la base: " + totalPayments);
            
            Object[] stats = null;
            
            // Essayer d'abord la requête JPA
            try {
                System.out.println("🔍 Tentative avec requête JPA...");
                stats = paymentRepository.getPaymentStats();
                System.out.println("✅ Requête JPA réussie");
            } catch (Exception jpaError) {
                System.err.println("❌ Erreur requête JPA: " + jpaError.getMessage());
                System.out.println("🔄 Tentative avec requête native...");
                
                // Si la requête JPA échoue, utiliser la requête native
                try {
                    stats = paymentRepository.getPaymentStatsNative();
                    System.out.println("✅ Requête native réussie");
                } catch (Exception nativeError) {
                    System.err.println("❌ Erreur requête native: " + nativeError.getMessage());
                    throw new RuntimeException("Les deux requêtes de statistiques ont échoué", nativeError);
                }
            }
            
            System.out.println("Statistiques brutes retournées par la requête:");
            for (int i = 0; i < stats.length; i++) {
                System.out.println("  stats[" + i + "] = " + stats[i] + " (type: " + (stats[i] != null ? stats[i].getClass().getSimpleName() : "null") + ")");
            }
            
            Map<String, Object> result = new HashMap<>();
            
            // Gestion sécurisée des valeurs avec conversion explicite
            result.put("totalTransactions", stats.length > 0 && stats[0] != null ? convertToLong(stats[0]) : 0L);
            result.put("successfulTransactions", stats.length > 1 && stats[1] != null ? convertToLong(stats[1]) : 0L);
            result.put("failedTransactions", stats.length > 2 && stats[2] != null ? convertToLong(stats[2]) : 0L);
            result.put("pendingTransactions", stats.length > 3 && stats[3] != null ? convertToLong(stats[3]) : 0L);
            result.put("totalRevenue", stats.length > 4 && stats[4] != null ? convertToBigDecimal(stats[4]) : BigDecimal.ZERO);
            result.put("successfulRevenue", stats.length > 5 && stats[5] != null ? convertToBigDecimal(stats[5]) : BigDecimal.ZERO);
            result.put("todayTransactions", paymentRepository.getTodayTransactionsCount());
            
            // Calculer le solde disponible (transactions réussies)
            BigDecimal availableBalance = stats.length > 5 && stats[5] != null ? convertToBigDecimal(stats[5]) : BigDecimal.ZERO;
            result.put("availableBalance", availableBalance);
            
            // Calculer le nombre de produits vendus
            int totalProductsSold = 0;
            List<Payment> successfulPayments = paymentRepository.findByStatusOrderByCreatedAtDesc("SUCCESS");
            for (Payment payment : successfulPayments) {
                if (payment.getProducts() != null) {
                    totalProductsSold += payment.getProducts().size();
                }
            }
            result.put("totalProductsSold", totalProductsSold);
            
            // Ajouter des statistiques supplémentaires
            result.put("pendingAmount", paymentRepository.sumAmountByStatus("PENDING"));
            
            System.out.println("=== STATISTIQUES FINALES ===");
            System.out.println("Total transactions: " + result.get("totalTransactions"));
            System.out.println("Successful transactions: " + result.get("successfulTransactions"));
            System.out.println("Failed transactions: " + result.get("failedTransactions"));
            System.out.println("Pending transactions: " + result.get("pendingTransactions"));
            System.out.println("Total revenue: " + result.get("totalRevenue"));
            System.out.println("Successful revenue: " + result.get("successfulRevenue"));
            System.out.println("Available balance: " + result.get("availableBalance"));
            System.out.println("Total products sold: " + result.get("totalProductsSold"));
            System.out.println("Today transactions: " + result.get("todayTransactions"));
            
            return result;
            
        } catch (Exception e) {
            System.err.println("❌ Erreur lors du calcul des statistiques de paiements: " + e.getMessage());
            e.printStackTrace();
            
            // Retourner des valeurs par défaut en cas d'erreur
            Map<String, Object> defaultStats = new HashMap<>();
            defaultStats.put("totalTransactions", 0L);
            defaultStats.put("successfulTransactions", 0L);
            defaultStats.put("failedTransactions", 0L);
            defaultStats.put("pendingTransactions", 0L);
            defaultStats.put("totalRevenue", BigDecimal.ZERO);
            defaultStats.put("successfulRevenue", BigDecimal.ZERO);
            defaultStats.put("availableBalance", BigDecimal.ZERO);
            defaultStats.put("totalProductsSold", 0);
            defaultStats.put("todayTransactions", 0L);
            defaultStats.put("pendingAmount", BigDecimal.ZERO);
            
            return defaultStats;
        }
    }
    
    // Méthode utilitaire pour convertir en Long
    private Long convertToLong(Object value) {
        if (value == null) return 0L;
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        try {
            return Long.parseLong(value.toString());
        } catch (NumberFormatException e) {
            System.err.println("Erreur de conversion Long pour la valeur: " + value);
            return 0L;
        }
    }
    
    // Méthode utilitaire pour convertir en BigDecimal
    private BigDecimal convertToBigDecimal(Object value) {
        if (value == null) return BigDecimal.ZERO;
        if (value instanceof BigDecimal) {
            return (BigDecimal) value;
        }
        if (value instanceof Number) {
            return BigDecimal.valueOf(((Number) value).doubleValue());
        }
        try {
            return new BigDecimal(value.toString());
        } catch (NumberFormatException e) {
            System.err.println("Erreur de conversion BigDecimal pour la valeur: " + value);
            return BigDecimal.ZERO;
        }
    }
    
    // Rechercher des paiements
    public List<Payment> searchPayments(String searchTerm) {
        return paymentRepository.searchPayments(searchTerm);
    }
    
    // Récupérer les paiements par plage de dates
    public List<Payment> getPaymentsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRepository.findByDateRange(startDate, endDate);
    }
    
    // Calculer le montant retirable (transactions réussies des 30 derniers jours)
    public BigDecimal getWithdrawableAmount() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return paymentRepository.sumAmountByStatusAndDate("SUCCESS", thirtyDaysAgo, LocalDateTime.now());
    }
}
