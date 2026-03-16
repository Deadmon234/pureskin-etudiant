package com.pureskin.etudiant.controller;

import com.pureskin.etudiant.model.BlogPost;
import com.pureskin.etudiant.repository.BlogPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/blog")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowedHeaders = "*")
public class BlogController {
    
    @Autowired
    private BlogPostRepository blogPostRepository;
    
    @GetMapping
    public List<BlogPost> getAllPublishedPosts() {
        return blogPostRepository.findByIsPublishedOrderByPublishedAtDesc(true);
    }
    
    @GetMapping("/page")
    public Page<BlogPost> getPublishedPostsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return blogPostRepository.findByIsPublishedOrderByPublishedAtDesc(true, pageable);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BlogPost> getPostById(@PathVariable Long id) {
        Optional<BlogPost> post = blogPostRepository.findById(id);
        return post.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/slug/{slug}")
    public ResponseEntity<BlogPost> getPostBySlug(@PathVariable String slug) {
        BlogPost post = blogPostRepository.findBySlug(slug);
        if (post != null) {
            return ResponseEntity.ok(post);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/search")
    public List<BlogPost> searchPosts(@RequestParam String q) {
        return blogPostRepository.searchPublishedPosts(q);
    }
    
    @GetMapping("/recent")
    public List<BlogPost> getRecentPosts(@RequestParam(defaultValue = "3") int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        Page<BlogPost> posts = blogPostRepository.findByIsPublishedOrderByPublishedAtDesc(true, pageable);
        return posts.getContent();
    }
    
    @PostMapping
    public BlogPost createPost(@RequestBody BlogPost blogPost) {
        if (blogPost.getIsPublished() != null && blogPost.getIsPublished()) {
            blogPost.setPublishedAt(java.time.LocalDateTime.now());
        }
        return blogPostRepository.save(blogPost);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<BlogPost> updatePost(@PathVariable Long id, @RequestBody BlogPost postDetails) {
        Optional<BlogPost> post = blogPostRepository.findById(id);
        if (post.isPresent()) {
            BlogPost existingPost = post.get();
            existingPost.setTitle(postDetails.getTitle());
            existingPost.setSlug(postDetails.getSlug());
            existingPost.setExcerpt(postDetails.getExcerpt());
            existingPost.setContent(postDetails.getContent());
            existingPost.setFeaturedImage(postDetails.getFeaturedImage());
            existingPost.setAuthor(postDetails.getAuthor());
            existingPost.setReadingTime(postDetails.getReadingTime());
            existingPost.setIsPublished(postDetails.getIsPublished());
            
            // Si publication pour la première fois
            if (postDetails.getIsPublished() != null && postDetails.getIsPublished() && existingPost.getPublishedAt() == null) {
                existingPost.setPublishedAt(java.time.LocalDateTime.now());
            }
            
            existingPost.setUpdatedAt(java.time.LocalDateTime.now());
            return ResponseEntity.ok(blogPostRepository.save(existingPost));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        Optional<BlogPost> post = blogPostRepository.findById(id);
        if (post.isPresent()) {
            blogPostRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
