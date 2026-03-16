package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.model.Product;
import com.pureskin.etudiant.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class AdminProductController {

    @Autowired
    private ProductService productService;

    // Répertoire de stockage des images
    private static final String UPLOAD_DIR = "uploads/products/";
    private static final String BASE_URL = "http://localhost:8080";

    // Obtenir tous les produits
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProducts() {
        try {
            System.out.println("=== RÉCUPÉRATION TOUS LES PRODUITS ADMIN ===");
            
            List<Product> products = productService.getAllActiveProducts();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Produits récupérés avec succès");
            response.put("data", products);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("❌ ERREUR RÉCUPÉRATION PRODUITS: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de la récupération des produits: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Obtenir un produit par ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable Long id) {
        try {
            Product product = productService.getProductById(id);
            
            if (product == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Produit non trouvé");
                return ResponseEntity.status(404).body(response);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Produit récupéré avec succès");
            response.put("data", product);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de la récupération du produit: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Créer un nouveau produit
    @PostMapping
    public ResponseEntity<Map<String, Object>> createProduct(
            @RequestParam(value = "name") String name,
            @RequestParam(value = "slug") String slug,
            @RequestParam(value = "description") String description,
            @RequestParam(value = "price") Double price,
            @RequestParam(value = "category") String category,
            @RequestParam(value = "stock") Integer stock,
            @RequestParam(value = "active") Boolean active,
            @RequestParam(value = "badge", required = false) String badge,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        
        try {
            System.out.println("=== CRÉATION PRODUIT ADMIN ===");
            System.out.println("Nom: " + name);
            System.out.println("Prix: " + price);
            System.out.println("Image: " + (imageFile != null ? imageFile.getOriginalFilename() : "Aucune"));

            // Créer le produit
            Product product = new Product();
            product.setName(name);
            product.setSlug(slug);
            product.setDescription(description);
            product.setPrice(BigDecimal.valueOf(price));
            product.setCategory(category);
            product.setStock(stock);
            product.setActive(true);

            // Créer d'abord le produit sans image
            Product savedProduct = productService.createProduct(product);
            
            // Gérer l'image si fournie
            if (imageFile != null && !imageFile.isEmpty()) {
                String imageUrl = saveImage(imageFile, savedProduct.getId());
                savedProduct.setImageUrl(imageUrl);
                // Mettre à jour le produit avec l'URL de l'image
                savedProduct = productService.updateProduct(savedProduct.getId(), savedProduct);
            } else {
                // Image par défaut
                savedProduct.setImageUrl(null); // Pas d'image par défaut
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Produit créé avec succès");
            response.put("data", savedProduct);

            System.out.println("✅ PRODUIT CRÉÉ: " + savedProduct.getName());
            return ResponseEntity.status(201).body(response);

        } catch (Exception e) {
            System.out.println("❌ ERREUR CRÉATION PRODUIT: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de la création du produit: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Mettre à jour un produit
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "slug", required = false) String slug,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) Double price,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "stock", required = false) Integer stock,
            @RequestParam(value = "active", required = false) Boolean active,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        
        try {
            System.out.println("=== MISE À JOUR PRODUIT ADMIN ===");
            System.out.println("ID: " + id);

            Product existingProduct = productService.getProductById(id);
            if (existingProduct == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Produit non trouvé");
                return ResponseEntity.status(404).body(response);
            }

            // Mettre à jour les champs fournis
            if (name != null) existingProduct.setName(name);
            if (slug != null) existingProduct.setSlug(slug);
            if (description != null) existingProduct.setDescription(description);
            if (price != null) existingProduct.setPrice(BigDecimal.valueOf(price));
            if (category != null) existingProduct.setCategory(category);
            if (stock != null) existingProduct.setStock(stock);
            if (active != null) existingProduct.setActive(active);

            // Gérer l'image si fournie
            if (imageFile != null && !imageFile.isEmpty()) {
                String imageUrl = saveImage(imageFile, id);
                existingProduct.setImageUrl(imageUrl);
            }

            Product updatedProduct = productService.updateProduct(id, existingProduct);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Produit mis à jour avec succès");
            response.put("data", updatedProduct);

            System.out.println("✅ PRODUIT MIS À JOUR: " + updatedProduct.getName());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ ERREUR MISE À JOUR PRODUIT: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de la mise à jour du produit: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Supprimer un produit
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        try {
            System.out.println("=== SUPPRESSION PRODUIT ADMIN ===");
            System.out.println("ID: " + id);

            Product existingProduct = productService.getProductById(id);
            if (existingProduct == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Produit non trouvé");
                return ResponseEntity.status(404).body(response);
            }

            productService.deleteProduct(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Produit supprimé avec succès");

            System.out.println("✅ PRODUIT SUPPRIMÉ: " + existingProduct.getName());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ ERREUR SUPPRESSION PRODUIT: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de la suppression du produit: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Méthode utilitaire pour sauvegarder les images
    private String saveImage(MultipartFile file, Long productId) throws IOException {
        // Créer le répertoire s'il n'existe pas
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Générer un nom de fichier unique avec l'ID du produit
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ? 
            originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
        String filename = "product-" + productId + "-" + System.currentTimeMillis() + extension;
        
        // Sauvegarder le fichier
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        // Retourner l'URL publique
        return BASE_URL + "/api/admin/products/images/" + filename;
    }
}
