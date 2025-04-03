// KingDevil Website - Admin Panel JavaScript

// DOM Elements
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminLoginModal = document.getElementById('adminLoginModal');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminPanel = document.getElementById('adminPanel');
const loginStatus = document.getElementById('loginStatus');
const logoutBtn = document.getElementById('logoutBtn');
const postForm = document.getElementById('postForm');
const postTitle = document.getElementById('postTitle');
const postImage = document.getElementById('postImage');
const postContent = document.getElementById('postContent');
const imagePreview = document.getElementById('imagePreview');
const postId = document.getElementById('postId');
const cancelEdit = document.getElementById('cancelEdit');
const adminPostsList = document.getElementById('adminPostsList');
const blogPostsContainer = document.getElementById('blog-posts-container');
const blogEmpty = document.getElementById('blog-empty');
const searchInput = document.getElementById('searchPosts');
const exportBtn = document.getElementById('exportPosts');
const importBtn = document.getElementById('importPosts');
const importFile = document.getElementById('importFile');

// Admin password (in a real application, this would be handled server-side)
const ADMIN_PASSWORD = 'kingdevil2025';

// Open admin login modal
if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', () => {
        adminLoginModal.style.display = 'flex';
    });
}

// Close modal when clicking on X
const closeButtons = document.querySelectorAll('.close');
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
});

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === adminLoginModal) {
        adminLoginModal.style.display = 'none';
    }
});

// Admin Login
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const password = document.getElementById('adminPassword').value;
        
        if (password === ADMIN_PASSWORD) {
            adminLoginModal.style.display = 'none';
            adminPanel.style.display = 'block';
            loadAdminPosts();
        } else {
            loginStatus.innerHTML = '<p class="error">Incorrect password</p>';
            
            // Clear error message after 3 seconds
            setTimeout(() => {
                loginStatus.innerHTML = '';
            }, 3000);
        }
    });
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        adminPanel.style.display = 'none';
        document.getElementById('adminPassword').value = '';
    });
}

// Handle image upload and preview
if (postImage) {
    postImage.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            
            reader.readAsDataURL(file);
        }
    });
}

// Handle post form submission
if (postForm) {
    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate form
        if (!postTitle.value || !postContent.value || (!postId.value && !postImage.files[0])) {
            alert('Please fill in all fields');
            return;
        }
        
        // Create post object
        const post = {
            id: postId.value,
            title: postTitle.value,
            content: postContent.value
        };
        
        // Handle image
        if (postImage.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                post.image = event.target.result;
                
                // Save post using database
                if (post.id) {
                    postDB.updatePost(post);
                } else {
                    postDB.addPost(post);
                }
                
                // Reset form
                postForm.reset();
                postId.value = '';
                imagePreview.innerHTML = '';
                cancelEdit.style.display = 'none';
                
                // Update UI
                loadAdminPosts();
                loadBlogPosts();
            };
            
            reader.readAsDataURL(postImage.files[0]);
        } else {
            // Keep existing image if editing
            if (post.id) {
                const existingPost = postDB.getPostById(post.id);
                
                if (existingPost) {
                    post.image = existingPost.image;
                    postDB.updatePost(post);
                    
                    // Reset form
                    postForm.reset();
                    postId.value = '';
                    imagePreview.innerHTML = '';
                    cancelEdit.style.display = 'none';
                    
                    // Update UI
                    loadAdminPosts();
                    loadBlogPosts();
                }
            }
        }
    });
}

// Cancel edit
if (cancelEdit) {
    cancelEdit.addEventListener('click', () => {
        postForm.reset();
        postId.value = '';
        imagePreview.innerHTML = '';
        cancelEdit.style.display = 'none';
    });
}

// Load posts in admin panel
function loadAdminPosts() {
    if (!adminPostsList) return;
    
    const posts = postDB.getSortedPosts();
    
    if (posts.length === 0) {
        adminPostsList.innerHTML = '<p>No posts available.</p>';
        return;
    }
    
    let html = '<div class="admin-posts-list">';
    
    posts.forEach(post => {
        html += `
            <div class="admin-post-item">
                <div class="admin-post-info">
                    <h4>${post.title}</h4>
                    <p class="post-date">${post.date}${post.edited ? ' (edited)' : ''}</p>
                </div>
                <div class="admin-post-actions">
                    <button class="btn-edit" onclick="editPost('${post.id}')">Edit</button>
                    <button class="btn-delete" onclick="if(confirm('Are you sure you want to delete this post?')) { deletePost('${post.id}'); }">Delete</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    adminPostsList.innerHTML = html;
}

// Edit post
function editPost(id) {
    const post = postDB.getPostById(id);
    
    if (post) {
        postId.value = post.id;
        postTitle.value = post.title;
        postContent.value = post.content;
        
        if (post.image) {
            imagePreview.innerHTML = `<img src="${post.image}" alt="Preview">`;
        }
        
        cancelEdit.style.display = 'inline-block';
    }
}

// Delete post
function deletePost(id) {
    postDB.deletePost(id);
    loadAdminPosts();
    loadBlogPosts();
}

// Load posts in blog section
function loadBlogPosts() {
    if (!blogPostsContainer || !blogEmpty) return;
    
    const posts = postDB.getSortedPosts();
    
    if (posts.length === 0) {
        blogPostsContainer.innerHTML = '';
        blogEmpty.style.display = 'block';
        return;
    }
    
    blogEmpty.style.display = 'none';
    
    let html = '';
    
    posts.forEach(post => {
        html += `
            <div class="blog-card" data-id="${post.id}">
                <div class="blog-image">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="blog-content">
                    <h3>${post.title}</h3>
                    <p class="blog-date">${post.date}${post.edited ? ' (edited)' : ''}</p>
                    <p class="blog-excerpt">${post.content.substring(0, 100)}...</p>
                    <button class="btn-read-more" onclick="openPostModal('${post.id}')">Read More</button>
                </div>
            </div>
        `;
    });
    
    blogPostsContainer.innerHTML = html;
    
    // Add click event to blog cards
    document.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-read-more')) {
                const id = card.getAttribute('data-id');
                openPostModal(id);
            }
        });
    });
}

// Open post modal
function openPostModal(id) {
    const post = postDB.getPostById(id);
    
    if (post) {
        const postModal = document.getElementById('postModal');
        const postModalTitle = document.getElementById('postModalTitle');
        const postModalImage = document.getElementById('postModalImage');
        const postModalContent = document.getElementById('postModalContent');
        const postModalDate = document.getElementById('postModalDate');
        
        postModalTitle.textContent = post.title;
        postModalImage.src = post.image;
        postModalImage.alt = post.title;
        postModalContent.innerHTML = post.content;
        postModalDate.textContent = `Posted on ${post.date}${post.edited ? ' (edited)' : ''}`;
        
        postModal.style.display = 'flex';
    }
}

// Search posts
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        const posts = postDB.searchPosts(query);
        
        if (posts.length === 0) {
            blogPostsContainer.innerHTML = '';
            blogEmpty.style.display = 'block';
            blogEmpty.innerHTML = '<p>No posts match your search.</p>';
            return;
        }
        
        blogEmpty.style.display = 'none';
        
        let html = '';
        
        posts.forEach(post => {
            html += `
                <div class="blog-card" data-id="${post.id}">
                    <div class="blog-image">
                        <img src="${post.image}" alt="${post.title}">
                    </div>
                    <div class="blog-content">
                        <h3>${post.title}</h3>
                        <p class="blog-date">${post.date}${post.edited ? ' (edited)' : ''}</p>
                        <p class="blog-excerpt">${post.content.substring(0, 100)}...</p>
                        <button class="btn-read-more" onclick="openPostModal('${post.id}')">Read More</button>
                    </div>
                </div>
            `;
        });
        
        blogPostsContainer.innerHTML = html;
    });
}

// Export posts
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        const dataUri = postDB.exportPosts();
        const link = document.createElement('a');
        
        link.setAttribute('href', dataUri);
        link.setAttribute('download', 'kingdevil-posts.json');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// Import posts
if (importBtn && importFile) {
    importBtn.addEventListener('click', () => {
        importFile.click();
    });
    
    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const result = postDB.importPosts(event.target.result);
                
                if (result) {
                    alert('Posts imported successfully!');
                    loadAdminPosts();
                    loadBlogPosts();
                } else {
                    alert('Error importing posts. Please check the file format.');
                }
                
                importFile.value = '';
            };
            
            reader.readAsText(file);
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
});
