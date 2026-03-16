package com.pureskin.etudiant.service;

import com.pureskin.etudiant.model.Customer;
import com.pureskin.etudiant.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    // Trouver ou créer un client par email
    public Customer findOrCreateCustomer(String email, String firstName, String lastName, String phone, String address, String city, String postalCode, String country) {
        Optional<Customer> existingCustomer = customerRepository.findByEmail(email);
        
        if (existingCustomer.isPresent()) {
            return existingCustomer.get();
        }
        
        // Créer un nouveau client
        Customer newCustomer = new Customer();
        newCustomer.setEmail(email);
        newCustomer.setFirstName(firstName);
        newCustomer.setLastName(lastName);
        newCustomer.setPhone(phone);
        newCustomer.setAddress(address);
        newCustomer.setCity(city);
        newCustomer.setPostalCode(postalCode);
        newCustomer.setCountry(country);
        newCustomer.setIsActive(true);
        // Générer un password_hash par défaut pour les clients créés via commande
        newCustomer.setPasswordHash("DEFAULT_PASSWORD_" + System.currentTimeMillis());
        
        return customerRepository.save(newCustomer);
    }
    
    // Trouver un client par email
    public Optional<Customer> findByEmail(String email) {
        return customerRepository.findByEmail(email);
    }
    
    // Trouver un client par ID
    public Optional<Customer> findById(Long id) {
        return customerRepository.findById(id);
    }
}
