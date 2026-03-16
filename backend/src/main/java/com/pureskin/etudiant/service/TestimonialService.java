package com.pureskin.etudiant.service;

import com.pureskin.etudiant.model.Testimonial;
import com.pureskin.etudiant.repository.TestimonialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TestimonialService {
    
    @Autowired
    private TestimonialRepository testimonialRepository;
    
    // Obtenir tous les témoignages
    public List<Testimonial> findAll() {
        return testimonialRepository.findAll();
    }
    
    // Obtenir un témoignage par son ID
    public Optional<Testimonial> findById(Long id) {
        return testimonialRepository.findById(id);
    }
    
    // Sauvegarder un témoignage
    public Testimonial saveTestimonial(Testimonial testimonial) {
        return testimonialRepository.save(testimonial);
    }
    
    // Supprimer un témoignage
    public void deleteTestimonial(Long id) {
        testimonialRepository.deleteById(id);
    }
    
    // Obtenir les témoignages approuvés
    public List<Testimonial> findByApproved(boolean approved) {
        return testimonialRepository.findByIsApproved(approved);
    }
    
    // Obtenir les témoignages par note
    public List<Testimonial> findByRating(int rating) {
        return testimonialRepository.findByRating(rating);
    }
    
    // Obtenir les témoignages par produit
    public List<Testimonial> findByProductName(String productName) {
        return testimonialRepository.findByProductName(productName);
    }
    
    // Obtenir la note moyenne
    public double getAverageRating() {
        return testimonialRepository.calculateAverageRating();
    }
    
    // Obtenir les témoignages récents
    public List<Testimonial> findRecentTestimonials() {
        return testimonialRepository.findRecentTestimonials();
    }
    
    // Pagination avec tri
    public Page<Testimonial> findAll(Pageable pageable) {
        return testimonialRepository.findAll(pageable);
    }
    
    // Obtenir les témoignages en attente d'approbation
    public List<Testimonial> findPendingApproval() {
        return testimonialRepository.findByIsApproved(false);
    }
    
    // Approuver un témoignage
    public Testimonial approveTestimonial(Long id) {
        Optional<Testimonial> testimonialOpt = testimonialRepository.findById(id);
        if (testimonialOpt.isPresent()) {
            Testimonial testimonial = testimonialOpt.get();
            testimonial.setIsApproved(true);
            return testimonialRepository.save(testimonial);
        }
        throw new RuntimeException("Témoignage non trouvé avec l'ID: " + id);
    }
    
    // Rejeter un témoignage
    public Testimonial rejectTestimonial(Long id) {
        Optional<Testimonial> testimonialOpt = testimonialRepository.findById(id);
        if (testimonialOpt.isPresent()) {
            Testimonial testimonial = testimonialOpt.get();
            testimonial.setIsApproved(false);
            return testimonialRepository.save(testimonial);
        }
        throw new RuntimeException("Témoignage non trouvé avec l'ID: " + id);
    }
}
