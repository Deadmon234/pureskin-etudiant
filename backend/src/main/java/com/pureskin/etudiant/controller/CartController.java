package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.model.CartItem;
import com.pureskin.etudiant.model.Product;
import com.pureskin.etudiant.repository.CartItemRepository;
import com.pureskin.etudiant.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class CartController {
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @GetMapping
    public ResponseEntity<?> getCartItems(@RequestParam(required = false) String sessionId,
                                           @RequestParam(required = false) Long customerId) {
        List<CartItem> cartItems;
        
        if (customerId != null) {
            cartItems = cartItemRepository.findByCustomerId(customerId);
        } else if (sessionId != null) {
            cartItems = cartItemRepository.findBySessionId(sessionId);
        } else {
            return ResponseEntity.badRequest().body("Session ID or Customer ID is required");
        }
        
        // Calculate totals
        Map<String, Object> response = new HashMap<>();
        response.put("items", cartItems);
        response.put("itemCount", cartItems.stream().mapToInt(CartItem::getQuantity).sum());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestParam(required = false) String sessionId,
                                      @RequestParam(required = false) Long customerId,
                                      @RequestParam Long productId,
                                      @RequestParam(defaultValue = "1") Integer quantity) {
        
        // Check if product exists and is available
        Optional<Product> productOpt = productRepository.findById(productId);
        if (!productOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Product product = productOpt.get();
        if (!product.getIsActive() || product.getStockQuantity() < quantity) {
            return ResponseEntity.badRequest().body("Product not available or insufficient stock");
        }
        
        CartItem cartItem;
        
        if (customerId != null) {
            // For logged-in users
            Optional<CartItem> existingItem = cartItemRepository.findByCustomerIdAndProductId(customerId, productId);
            if (existingItem.isPresent()) {
                cartItem = existingItem.get();
                cartItem.setQuantity(cartItem.getQuantity() + quantity);
            } else {
                cartItem = new CartItem();
                cartItem.setCustomerId(customerId);
                cartItem.setProductId(productId);
                cartItem.setQuantity(quantity);
            }
        } else if (sessionId != null) {
            // For guest users
            Optional<CartItem> existingItem = cartItemRepository.findBySessionIdAndProductId(sessionId, productId);
            if (existingItem.isPresent()) {
                cartItem = existingItem.get();
                cartItem.setQuantity(cartItem.getQuantity() + quantity);
            } else {
                cartItem = new CartItem();
                cartItem.setSessionId(sessionId);
                cartItem.setProductId(productId);
                cartItem.setQuantity(quantity);
            }
        } else {
            return ResponseEntity.badRequest().body("Session ID or Customer ID is required");
        }
        
        CartItem savedItem = cartItemRepository.save(cartItem);
        return ResponseEntity.ok(savedItem);
    }
    
    @PutMapping("/update")
    public ResponseEntity<?> updateCartItem(@RequestParam(required = false) String sessionId,
                                          @RequestParam(required = false) Long customerId,
                                          @RequestParam Long productId,
                                          @RequestParam Integer quantity) {
        
        if (quantity <= 0) {
            return ResponseEntity.badRequest().body("Quantity must be positive");
        }
        
        Optional<CartItem> cartItemOpt;
        
        if (customerId != null) {
            cartItemOpt = cartItemRepository.findByCustomerIdAndProductId(customerId, productId);
        } else if (sessionId != null) {
            cartItemOpt = cartItemRepository.findBySessionIdAndProductId(sessionId, productId);
        } else {
            return ResponseEntity.badRequest().body("Session ID or Customer ID is required");
        }
        
        if (!cartItemOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        CartItem cartItem = cartItemOpt.get();
        cartItem.setQuantity(quantity);
        
        CartItem savedItem = cartItemRepository.save(cartItem);
        return ResponseEntity.ok(savedItem);
    }
    
    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromCart(@RequestParam(required = false) String sessionId,
                                           @RequestParam(required = false) Long customerId,
                                           @RequestParam Long productId) {
        
        Optional<CartItem> cartItemOpt;
        
        if (customerId != null) {
            cartItemOpt = cartItemRepository.findByCustomerIdAndProductId(customerId, productId);
        } else if (sessionId != null) {
            cartItemOpt = cartItemRepository.findBySessionIdAndProductId(sessionId, productId);
        } else {
            return ResponseEntity.badRequest().body("Session ID or Customer ID is required");
        }
        
        if (!cartItemOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        cartItemRepository.delete(cartItemOpt.get());
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestParam(required = false) String sessionId,
                                      @RequestParam(required = false) Long customerId) {
        
        if (customerId != null) {
            cartItemRepository.deleteByCustomerId(customerId);
        } else if (sessionId != null) {
            cartItemRepository.deleteBySessionId(sessionId);
        } else {
            return ResponseEntity.badRequest().body("Session ID or Customer ID is required");
        }
        
        return ResponseEntity.ok().build();
    }
}
