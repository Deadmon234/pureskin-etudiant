package com.pureskin.etudiant.service;

import com.pureskin.etudiant.model.Transaction;
import com.pureskin.etudiant.model.TransactionStatus;
import com.pureskin.etudiant.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> getAllTransactions(int page, int limit, String status, String startDate, String endDate) {
        List<Transaction> transactions;
        
        if (status != null && !status.isEmpty()) {
            TransactionStatus transactionStatus = TransactionStatus.valueOf(status.toUpperCase());
            transactions = transactionRepository.findByStatusOrderByCreatedAtDesc(transactionStatus);
        } else {
            transactions = transactionRepository.findAllByOrderByCreatedAtDesc();
        }
        
        // Pagination simple
        int startIndex = page * limit;
        int endIndex = Math.min(startIndex + limit, transactions.size());
        
        return transactions.subList(startIndex, endIndex);
    }

    public long countTransactions(String status, String startDate, String endDate) {
        if (status != null && !status.isEmpty()) {
            TransactionStatus transactionStatus = TransactionStatus.valueOf(status.toUpperCase());
            return transactionRepository.countByStatus(transactionStatus);
        } else {
            return transactionRepository.count();
        }
    }

    public Transaction getTransactionById(String id) {
        try {
            Long transactionId = Long.parseLong(id);
            Optional<Transaction> transaction = transactionRepository.findById(transactionId);
            return transaction.orElse(null);
        } catch (NumberFormatException e) {
            // Chercher par transactionId si ce n'est pas un nombre
            return transactionRepository.findByTransactionId(id).orElse(null);
        }
    }

    public Transaction getTransactionByTransactionId(String transactionId) {
        return transactionRepository.findByTransactionId(transactionId).orElse(null);
    }

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public Transaction createTransaction(String orderNumber, String customerEmail, Double amount, 
                                    String currency, String paymentMethod, String walletId, String sessionToken) {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(generateTransactionId());
        transaction.setOrderNumber(orderNumber);
        transaction.setCustomerEmail(customerEmail);
        transaction.setAmount(amount);
        transaction.setCurrency(currency);
        transaction.setPaymentMethod(paymentMethod);
        transaction.setWalletId(walletId);
        transaction.setSessionToken(sessionToken);
        transaction.setStatus(TransactionStatus.PENDING);
        
        return saveTransaction(transaction);
    }

    public Transaction updateTransactionStatus(String transactionId, String status, Map<String, Object> webhookData) {
        Transaction transaction = getTransactionByTransactionId(transactionId);
        
        if (transaction != null) {
            try {
                TransactionStatus newStatus = TransactionStatus.valueOf(status.toUpperCase());
                transaction.setStatus(newStatus);
                transaction.setProcessedAt(LocalDateTime.now());
                
                // Sauvegarder la réponse complète du webhook
                if (webhookData != null) {
                    transaction.setFarotyResponse(webhookData.toString());
                }
                
                if (newStatus == TransactionStatus.FAILED && webhookData != null) {
                    String failureReason = (String) webhookData.get("failureReason");
                    if (failureReason != null) {
                        transaction.setFailureReason(failureReason);
                    }
                }
                
                return saveTransaction(transaction);
            } catch (IllegalArgumentException e) {
                // Statut invalide, garder le statut actuel
                System.err.println("Statut de transaction invalide: " + status);
                return transaction;
            }
        }
        
        return null;
    }

    public boolean processRefund(String transactionId, String reason, Double amount) {
        Transaction transaction = getTransactionByTransactionId(transactionId);
        
        if (transaction != null && transaction.getStatus() == TransactionStatus.COMPLETED) {
            transaction.setStatus(TransactionStatus.REFUNDED);
            transaction.setFailureReason("Remboursement: " + reason);
            transaction.setProcessedAt(LocalDateTime.now());
            
            saveTransaction(transaction);
            return true;
        }
        
        return false;
    }

    public List<Transaction> getTransactionsByCustomerEmail(String customerEmail) {
        return transactionRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail);
    }

    public List<Transaction> getPendingTransactions() {
        return transactionRepository.findByStatusOrderByCreatedAtDesc(TransactionStatus.PENDING);
    }

    public List<Transaction> getCompletedTransactions() {
        return transactionRepository.findByStatusOrderByCreatedAtDesc(TransactionStatus.COMPLETED);
    }

    public List<Transaction> getFailedTransactions() {
        return transactionRepository.findByStatusOrderByCreatedAtDesc(TransactionStatus.FAILED);
    }

    public Map<String, Object> getTransactionStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalTransactions = transactionRepository.count();
        long pendingTransactions = transactionRepository.countByStatus(TransactionStatus.PENDING);
        long completedTransactions = transactionRepository.countByStatus(TransactionStatus.COMPLETED);
        long failedTransactions = transactionRepository.countByStatus(TransactionStatus.FAILED);
        long refundedTransactions = transactionRepository.countByStatus(TransactionStatus.REFUNDED);
        
        // Calculer le montant total
        Double totalAmount = transactionRepository.sumAmountByStatus(TransactionStatus.COMPLETED);
        Double pendingAmount = transactionRepository.sumAmountByStatus(TransactionStatus.PENDING);
        
        stats.put("totalTransactions", totalTransactions);
        stats.put("pendingTransactions", pendingTransactions);
        stats.put("completedTransactions", completedTransactions);
        stats.put("failedTransactions", failedTransactions);
        stats.put("refundedTransactions", refundedTransactions);
        stats.put("totalAmount", totalAmount != null ? totalAmount : 0.0);
        stats.put("pendingAmount", pendingAmount != null ? pendingAmount : 0.0);
        stats.put("successRate", totalTransactions > 0 ? 
            (double) completedTransactions / totalTransactions * 100 : 0.0);
        stats.put("failureRate", totalTransactions > 0 ? 
            (double) failedTransactions / totalTransactions * 100 : 0.0);
        
        return stats;
    }

    private String generateTransactionId() {
        return "TXN-" + System.currentTimeMillis() + "-" + 
               String.format("%04d", (int) (Math.random() * 10000));
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
