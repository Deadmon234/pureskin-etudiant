package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.model.Product;
import com.pureskin.etudiant.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class ProductController {
    
    @Autowired
    private ProductRepository productRepository;
    
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findByIsActive(true);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/featured")
    public List<Product> getFeaturedProducts() {
        return productRepository.findFeaturedProducts();
    }
    
    @GetMapping("/available")
    public List<Product> getAvailableProducts() {
        return productRepository.findAvailableProducts();
    }
    
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String q) {
        return productRepository.searchProducts(q);
    }
    
    @GetMapping("/latest")
    public List<Product> getLatestProducts() {
        return productRepository.findLatestProducts();
    }
    
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        product.setIsActive(true);
        return productRepository.save(product);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            Product existingProduct = product.get();
            existingProduct.setName(productDetails.getName());
            existingProduct.setDescription(productDetails.getDescription());
            existingProduct.setPrice(productDetails.getPrice());
            existingProduct.setOriginalPrice(productDetails.getOriginalPrice());
            existingProduct.setImage(productDetails.getImage());
            existingProduct.setBadge(productDetails.getBadge());
            existingProduct.setStockQuantity(productDetails.getStockQuantity());
            existingProduct.setIsActive(productDetails.getIsActive());
            return ResponseEntity.ok(productRepository.save(existingProduct));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            Product existingProduct = product.get();
            existingProduct.setIsActive(false);
            productRepository.save(existingProduct);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
