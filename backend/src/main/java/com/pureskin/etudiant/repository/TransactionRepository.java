package com.pureskin.etudiant.repository;

import com.pureskin.etudiant.model.Transaction;
import com.pureskin.etudiant.model.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByTransactionId(String transactionId);
    
    List<Transaction> findByStatusOrderByCreatedAtDesc(TransactionStatus status);
    
    List<Transaction> findAllByOrderByCreatedAtDesc();
    
    List<Transaction> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);
    
    long countByStatus(TransactionStatus status);
    
    @Query("SELECT COALESCE(SUM(t.amount), 0.0) FROM Transaction t WHERE t.status = :status")
    Double sumAmountByStatus(@Param("status") TransactionStatus status);
    
    @Query("SELECT t FROM Transaction t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:startDate IS NULL OR t.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR t.createdAt <= :endDate) " +
           "ORDER BY t.createdAt DESC")
    List<Transaction> findTransactionsWithFilters(
        @Param("status") TransactionStatus status,
        @Param("startDate") java.time.LocalDateTime startDate,
        @Param("endDate") java.time.LocalDateTime endDate
    );
}
