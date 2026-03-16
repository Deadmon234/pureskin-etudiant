package com.pureskin.etudiant.repository;

import com.pureskin.etudiant.model.Routine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoutineRepository extends JpaRepository<Routine, Long> {
    
    List<Routine> findByIsRecommendedOrderByCreatedAtDesc(Boolean isRecommended);
    
    Routine findBySlug(String slug);
    
    List<Routine> findBySkinTypeOrderByCreatedAtDesc(String skinType);
    
    List<Routine> findByDifficultyLevelOrderByCreatedAtAsc(String difficultyLevel);
    
    @Query("SELECT r FROM Routine r ORDER BY r.createdAt DESC")
    List<Routine> findAllOrderByCreatedAtDesc();
}
