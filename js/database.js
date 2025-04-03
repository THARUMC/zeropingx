// KingDevil Website - Database Management System

// Database class to handle all post operations
class PostDatabase {
    constructor() {
        this.STORAGE_KEY = 'kingdevilPosts';
        this.posts = this.getPosts();
    }

    // Get all posts from localStorage
    getPosts() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    }

    // Save posts to localStorage
    savePosts(posts) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts));
    }

    // Add a new post
    addPost(post) {
        // Generate unique ID and add date
        post.id = this.generateId();
        post.date = new Date().toLocaleDateString();
        post.timestamp = Date.now();
        
        // Add post to array
        const posts = this.getPosts();
        posts.push(post);
        
        // Save to localStorage
        this.savePosts(posts);
        return post;
    }

    // Update an existing post
    updatePost(post) {
        const posts = this.getPosts();
        const index = posts.findIndex(p => p.id === post.id);
        
        if (index !== -1) {
            // Preserve the original date and update timestamp
            post.date = posts[index].date;
            post.timestamp = Date.now();
            post.edited = true;
            
            // Update post
            posts[index] = post;
            this.savePosts(posts);
            return post;
        }
        
        return null;
    }

    // Delete a post
    deletePost(id) {
        const posts = this.getPosts();
        const filteredPosts = posts.filter(post => post.id !== id);
        
        if (filteredPosts.length < posts.length) {
            this.savePosts(filteredPosts);
            return true;
        }
        
        return false;
    }

    // Get a single post by ID
    getPostById(id) {
        const posts = this.getPosts();
        return posts.find(post => post.id === id) || null;
    }

    // Get posts sorted by date (newest first)
    getSortedPosts() {
        const posts = this.getPosts();
        return posts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }

    // Search posts by title or content
    searchPosts(query) {
        if (!query) return this.getSortedPosts();
        
        query = query.toLowerCase();
        const posts = this.getPosts();
        
        return posts.filter(post => 
            post.title.toLowerCase().includes(query) || 
            post.content.toLowerCase().includes(query)
        ).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    // Export all posts as JSON
    exportPosts() {
        const posts = this.getPosts();
        const dataStr = JSON.stringify(posts, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        return dataUri;
    }

    // Import posts from JSON
    importPosts(jsonData) {
        try {
            const posts = JSON.parse(jsonData);
            
            if (Array.isArray(posts)) {
                this.savePosts(posts);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error importing posts:', error);
            return false;
        }
    }
}

// Create global instance
const postDB = new PostDatabase();
