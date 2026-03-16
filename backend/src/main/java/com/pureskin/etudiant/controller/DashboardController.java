package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.service.OrderService;
import com.pureskin.etudiant.service.UserService;
import com.pureskin.etudiant.service.ProductService;
import com.pureskin.etudiant.service.TestimonialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class DashboardController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private TestimonialService testimonialService;
    
    // Obtenir les statistiques du dashboard
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            System.out.println("=== RÉCUPÉRATION STATISTIQUES DASHBOARD ===");
            
            Map<String, Object> stats = new HashMap<>();
            
            // Statistiques des commandes
            Map<String, Object> ordersStats = orderService.getOrderStats();
            stats.put("totalOrders", ordersStats.get("totalOrders"));
            stats.put("totalRevenue", ordersStats.get("totalRevenue"));
            stats.put("pendingOrders", ordersStats.get("pendingOrders"));
            
            // Statistiques mensuelles
            LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            Map<String, Object> monthlyStats = orderService.getMonthlyStats(monthStart);
            stats.put("monthlyOrders", monthlyStats.get("monthlyOrders"));
            stats.put("monthlyRevenue", monthlyStats.get("monthlyRevenue"));
            
            // Statistiques des utilisateurs
            long totalUsers = userService.getTotalActiveUsers();
            stats.put("totalUsers", totalUsers);
            
            // Statistiques des produits
            long totalProducts = productService.getTotalActiveProducts();
            stats.put("totalProducts", totalProducts);
            
            // Statistiques des témoignages
            double averageRating = testimonialService.getAverageRating();
            stats.put("averageRating", averageRating);
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalOrders", ordersStats.get("totalOrders"));
            response.put("totalRevenue", ordersStats.get("totalRevenue"));
            response.put("totalUsers", totalUsers);
            response.put("totalProducts", totalProducts);
            response.put("pendingOrders", ordersStats.get("pendingOrders"));
            response.put("averageRating", averageRating);
            response.put("monthlyOrders", monthlyStats.get("monthlyOrders"));
            response.put("monthlyRevenue", monthlyStats.get("monthlyRevenue"));
            
            System.out.println("=== STATISTIQUES DASHBOARD RÉCUPÉRÉES ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("=== ERREUR STATISTIQUES DASHBOARD ===");
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de la récupération des statistiques: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
