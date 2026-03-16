package com.pureskin.etudiant.repository;

import com.pureskin.etudiant.model.LoyaltyProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoyaltyProgramRepository extends JpaRepository<LoyaltyProgram, Long> {
    
    List<LoyaltyProgram> findByIsActiveOrderBySortOrderAsc(Boolean isActive);
    
    List<LoyaltyProgram> findByIsActiveOrderByMinPointsAsc(Boolean isActive);
    
    LoyaltyProgram findByMinPointsLessThanEqualAndMaxPointsGreaterThanEqualOrderByMinPointsDesc(
        Integer minPoints, Integer maxPoints);
    
    @Query("SELECT p FROM LoyaltyProgram p WHERE p.isActive = true ORDER BY p.minPoints ASC")
    List<LoyaltyProgram> findActiveProgramsOrderByPoints();
    
    @Query("SELECT p FROM LoyaltyProgram p WHERE p.isActive = true AND p.minPoints <= ?1 ORDER BY p.minPoints DESC")
    List<LoyaltyProgram> findProgramsForPoints(Integer points);
}
