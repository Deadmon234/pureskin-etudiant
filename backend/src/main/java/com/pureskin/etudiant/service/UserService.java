package com.pureskin.etudiant.service;

import com.pureskin.etudiant.model.User;
import com.pureskin.etudiant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    // Trouver un utilisateur par son nom d'utilisateur
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    // Trouver un utilisateur par son ID
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    // Trouver un utilisateur par son email
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    // Trouver un utilisateur par email ou username
    public Optional<User> findByEmailOrUsername(String identifier) {
        Optional<User> userByEmail = userRepository.findByEmail(identifier);
        if (userByEmail.isPresent()) {
            return userByEmail;
        }
        return userRepository.findByUsername(identifier);
    }
    
    // Sauvegarder un utilisateur
    public User saveUser(User user) {
        if (user.getPasswordHash() != null && !user.getPasswordHash().startsWith("$2a$")) {
            // Hasher le mot de passe s'il n'est pas déjà hashé
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        }
        return userRepository.save(user);
    }
    
    // Mettre à jour la dernière connexion
    public void updateLastLogin(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
        }
    }
    
    // Vérifier le mot de passe
    public boolean checkPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }
    
    // Obtenir le nombre total d'utilisateurs actifs
    public long getTotalActiveUsers() {
        return userRepository.countByIsActive(true);
    }
    
    // Obtenir tous les utilisateurs avec pagination
    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }
    
    // Obtenir les utilisateurs par rôle
    public List<User> findByRole(String role) {
        return userRepository.findByRole(role);
    }
    
    // Obtenir les utilisateurs actifs par rôle
    public List<User> findByRoleAndIsActive(String role, boolean isActive) {
        return userRepository.findByRoleAndIsActive(role, isActive);
    }
    
    // Supprimer un utilisateur
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    // Désactiver un utilisateur
    public void deactivateUser(Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsActive(false);
            userRepository.save(user);
        }
    }
    
    // Activer un utilisateur
    public void activateUser(Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsActive(true);
            userRepository.save(user);
        }
    }
    
    // Mettre à jour le rôle d'un utilisateur
    public void updateUserRole(Long id, String newRole) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setRole(newRole);
            userRepository.save(user);
        }
    }
    
    // Vérifier si un nom d'utilisateur existe déjà
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    // Vérifier si un email existe déjà
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    // Implémentation de UserDetailsService pour Spring Security
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(username);
        }
        
        if (userOpt.isEmpty()) {
            throw new UsernameNotFoundException("Utilisateur non trouvé: " + username);
        }
        
        User user = userOpt.get();
        
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPasswordHash())
                .authorities("ROLE_" + user.getRole().toUpperCase())
                .build();
    }
}
