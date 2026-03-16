package com.pureskin.etudiant.service;

import com.pureskin.etudiant.model.Product;
import com.pureskin.etudiant.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    // Obtenir tous les produits
    public List<Product> findAll() {
        return productRepository.findAll();
    }
    
    // Obtenir un produit par son ID
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }
    
    // Sauvegarder un produit
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
    
    // Supprimer un produit
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    
    // Obtenir le nombre total de produits actifs
    public long getTotalActiveProducts() {
        return productRepository.countByIsActive(true);
    }
    
    // Obtenir les produits actifs
    public List<Product> findActiveProducts() {
        return productRepository.findByIsActive(true);
    }
    
    // Alias pour getAllActiveProducts
    public List<Product> getAllActiveProducts() {
        return findActiveProducts();
    }
    
    // Obtenir un produit par son ID
    public Product getProductById(Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        return productOpt.orElse(null);
    }
    
    // Créer un produit
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
    
    // Mettre à jour un produit
    public Product updateProduct(Long id, Product product) {
        Optional<Product> existingProductOpt = productRepository.findById(id);
        if (existingProductOpt.isPresent()) {
            Product existingProduct = existingProductOpt.get();
            existingProduct.setName(product.getName());
            existingProduct.setDescription(product.getDescription());
            existingProduct.setPrice(product.getPrice());
            existingProduct.setCategory(product.getCategory());
            existingProduct.setStockQuantity(product.getStockQuantity());
            existingProduct.setActive(product.getActive());
            if (product.getImageUrl() != null) {
                existingProduct.setImageUrl(product.getImageUrl());
            }
            return productRepository.save(existingProduct);
        }
        return null;
    }
    
    // Obtenir les produits par catégorie
    public List<Product> findByCategory(String category) {
        return productRepository.findByCategory(category);
    }
    
    // Obtenir les produits en promotion
    public List<Product> findPromotionalProducts() {
        return productRepository.findByIsPromotional(true);
    }
    
    // Rechercher des produits
    public List<Product> searchProducts(String searchTerm) {
        return productRepository.searchProducts(searchTerm);
    }
    
    // Pagination avec tri
    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }
    
    // Mettre à jour le stock d'un produit
    public Product updateStock(Long productId, int newStock) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setStock(newStock);
            return productRepository.save(product);
        }
        throw new RuntimeException("Produit non trouvé avec l'ID: " + productId);
    }
    
    // Vérifier si un produit est en stock
    public boolean isProductInStock(Long productId, int requiredQuantity) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            return product.getStock() >= requiredQuantity;
        }
        return false;
    }
}
