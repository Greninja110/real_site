/**
 * Blog JavaScript for Abhijeet's Portfolio Website
 * Handles blog filtering and navigation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog functionality
    initBlog();
});

/**
 * Initialize blog functionality
 */
function initBlog() {
    // Blog filtering
    const filterButtons = document.querySelectorAll('.blog-filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (filterButtons.length > 0 && blogCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get the filter value
                const filter = this.getAttribute('data-filter');
                
                // Filter blog posts
                blogCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Blog search functionality
    const blogSearchForm = document.querySelector('.blog-search-form');
    if (blogSearchForm) {
        blogSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchInput = this.querySelector('.blog-search-input');
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                return;
            }
            
            // Filter blog posts based on search term
            blogCards.forEach(card => {
                const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
                const excerpt = card.querySelector('.blog-card-excerpt').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Reset active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            filterButtons[0].classList.add('active'); // Set "All" as active
        });
    }
    
    // Year marker functionality for blog archives
    const yearMarkers = document.querySelectorAll('.blog-year-marker');
    if (yearMarkers.length > 0) {
        yearMarkers.forEach(marker => {
            marker.addEventListener('click', function() {
                const year = this.getAttribute('data-year');
                const yearSection = document.getElementById(`blog-year-${year}`);
                
                if (yearSection) {
                    // Smooth scroll to year section
                    yearSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Add active class
                    yearMarkers.forEach(m => m.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }
}

/**
 * Initialize blog on the blog index page
 */
function initBlogIndexPage() {
    // Category filtering
    const categoryButtons = document.querySelectorAll('.blog-category');
    const blogPosts = document.querySelectorAll('.blog-post-item');
    
    if (categoryButtons.length > 0 && blogPosts.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get the category value
                const category = this.getAttribute('data-category');
                
                // Filter blog posts
                blogPosts.forEach(post => {
                    if (category === 'all' || post.getAttribute('data-categories').includes(category)) {
                        post.style.display = 'block';
                    } else {
                        post.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Blog search
    const searchForm = document.querySelector('.blog-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchInput = this.querySelector('.blog-search-input');
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                return;
            }
            
            // Filter blog posts based on search term
            blogPosts.forEach(post => {
                const title = post.querySelector('.blog-post-item-title').textContent.toLowerCase();
                const excerpt = post.querySelector('.blog-post-item-excerpt').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
            
            // Reset active category button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            categoryButtons[0].classList.add('active'); // Set "All" as active
        });
    }
}

/**
 * Initialize blog post page
 */
function initBlogPostPage() {
    // Handle code block syntax highlighting
    const codeBlocks = document.querySelectorAll('pre code');
    if (typeof hljs !== 'undefined' && codeBlocks.length > 0) {
        codeBlocks.forEach(block => {
            hljs.highlightBlock(block);
        });
    }
    
    // Handle table of contents
    const tocContainer = document.querySelector('.table-of-contents');
    if (tocContainer) {
        const headings = document.querySelectorAll('.blog-post-content h2, .blog-post-content h3');
        
        if (headings.length > 0) {
            const toc = document.createElement('ul');
            
            headings.forEach((heading, index) => {
                // Add ID to heading if it doesn't have one
                if (!heading.id) {
                    heading.id = `heading-${index}`;
                }
                
                // Create TOC item
                const tocItem = document.createElement('li');
                const tocLink = document.createElement('a');
                
                tocLink.href = `#${heading.id}`;
                tocLink.textContent = heading.textContent;
                
                // Add class for H3 items
                if (heading.tagName === 'H3') {
                    tocItem.classList.add('toc-subitem');
                }
                
                tocItem.appendChild(tocLink);
                toc.appendChild(tocItem);
            });
            
            tocContainer.appendChild(toc);
        }
    }
}

// Make functions accessible globally
window.initBlogIndexPage = initBlogIndexPage;
window.initBlogPostPage = initBlogPostPage;