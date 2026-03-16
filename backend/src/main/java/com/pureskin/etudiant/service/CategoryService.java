package com.pureskin.etudiant.service;

import com.pureskin.etudiant.model.Category;
import com.pureskin.etudiant.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }
    
    public Optional<Category> getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug);
    }
    
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }
    
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
    
    public boolean existsBySlug(String slug) {
        return categoryRepository.existsBySlug(slug);
    }
}
