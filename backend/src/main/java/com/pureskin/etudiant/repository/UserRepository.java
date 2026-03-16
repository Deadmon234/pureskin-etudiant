package com.pureskin.etudiant.repository;

import com.pureskin.etudiant.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Trouver par nom d'utilisateur
    Optional<User> findByUsername(String username);
    
    // Trouver par email
    Optional<User> findByEmail(String email);
    
    // Compter les utilisateurs actifs
    long countByIsActive(boolean isActive);
    
    // Trouver par rôle
    List<User> findByRole(String role);
    
    // Trouver par rôle et statut actif
    List<User> findByRoleAndIsActive(String role, boolean isActive);
    
    // Vérifier l'existence par nom d'utilisateur
    boolean existsByUsername(String username);
    
    // Vérifier l'existence par email
    boolean existsByEmail(String email);
    
    // Trouver les utilisateurs actifs
    @Query("SELECT u FROM User u WHERE u.isActive = true ORDER BY u.createdAt DESC")
    List<User> findActiveUsers();
    
    // Rechercher des utilisateurs par nom ou email
    @Query("SELECT u FROM User u WHERE u.isActive = true AND (LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<User> searchActiveUsers(@Param("searchTerm") String searchTerm);
    
    // Pagination avec tri
    Page<User> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);
}
