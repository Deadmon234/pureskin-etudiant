package com.pureskin.etudiant.repository;

import com.pureskin.etudiant.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    // Trouver un client par email
    Optional<Customer> findByEmail(String email);
    
    // Trouver des clients par nom
    List<Customer> findByLastNameContainingIgnoreCase(String lastName);
    
    // Trouver des clients par ville
    List<Customer> findByCityIgnoreCase(String city);
    
    // Compter les clients actifs
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.isActive = true")
    Long countActiveCustomers();
    
    // Vérifier si un email existe déjà
    boolean existsByEmail(String email);
}
