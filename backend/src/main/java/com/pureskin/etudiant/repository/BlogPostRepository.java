package com.pureskin.etudiant.repository;

import com.pureskin.etudiant.model.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    
    List<BlogPost> findByIsPublishedOrderByPublishedAtDesc(Boolean isPublished);
    
    Page<BlogPost> findByIsPublishedOrderByPublishedAtDesc(Boolean isPublished, Pageable pageable);
    
    BlogPost findBySlug(String slug);
    
    @Query("SELECT p FROM BlogPost p WHERE p.isPublished = true AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<BlogPost> searchPublishedPosts(@Param("query") String query);
    
    @Query("SELECT p FROM BlogPost p WHERE p.isPublished = true ORDER BY p.publishedAt DESC")
    Page<BlogPost> findPublishedPostsOrderByPublishedAtDesc(Pageable pageable);
}
