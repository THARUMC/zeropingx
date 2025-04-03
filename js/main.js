// ZeroPingX Website - Main JavaScript

// Google Gemini API configuration
const GEMINI_API_KEY = "AIzaSyCBebd8t3r5LmAlSsSUlh6FlmVk7m5uZZc";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";



// DOM Elements
const header = document.getElementById('header');
const themeToggle = document.querySelector('.theme-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const statNumbers = document.querySelectorAll('.stat-number');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const chatButton = document.querySelector('.chat-button');
const chatBox = document.querySelector('.chat-box');
const closeChat = document.querySelector('.close-chat');
const chatInput = document.querySelector('.chat-input input');
const chatSendButton = document.querySelector('.chat-input button');
const chatMessages = document.querySelector('.chat-messages');
const faqItems = document.querySelectorAll('.faq-item');
const faqQuestions = document.querySelectorAll('.faq-question');

// Sticky Header
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    toggleTheme();
});

// Function to toggle theme
function toggleTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
    
    const sunIcon = themeToggle.querySelector('.fa-sun');
    const moonIcon = themeToggle.querySelector('.fa-moon');
    
    sunIcon.classList.toggle('active');
    moonIcon.classList.toggle('active');
    
    // Save theme preference
    const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
}

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        
        const sunIcon = themeToggle.querySelector('.fa-sun');
        const moonIcon = themeToggle.querySelector('.fa-moon');
        
        sunIcon.classList.add('active');
        moonIcon.classList.remove('active');
    }
});

// Mobile Menu Toggle
mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Parallax Effect for Vision Section
const parallaxBg = document.querySelector('.parallax-bg');

if (parallaxBg) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        parallaxBg.style.transform = `translateY(${scrollPosition * 0.4}px)`;
    });
}

// Statistics Counter Animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for Statistics Section
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            statNumbers.forEach(stat => {
                animateCounter(stat);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.getElementById('statistics');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Contact Form Submission
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            formStatus.innerHTML = '<p class="error">Please fill in all fields</p>';
            return;
        }
        
        // Simulate form submission
        formStatus.innerHTML = '<p class="sending">Sending message...</p>';
        
        setTimeout(() => {
            formStatus.innerHTML = '<p class="success">Message sent successfully! We\'ll get back to you soon.</p>';
            contactForm.reset();
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                formStatus.innerHTML = '';
            }, 5000);
        }, 1500);
    });
}

// FAQ Accordion
if (faqQuestions.length > 0) {
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            
            // Close all other FAQ items
            faqItems.forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            faqItem.classList.toggle('active');
        });
    });
}

// Programming Chatbot
const programmingChatInput = document.getElementById('programmingChatInput');
const programmingChatSend = document.getElementById('programmingChatSend');
const programmingChatMessages = document.getElementById('programmingChatMessages');

if (programmingChatInput && programmingChatSend && programmingChatMessages) {
    // Function to add message to chat
    function addProgrammingChatMessage(message, isUser) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chatbot-message');
        messageElement.classList.add(isUser ? 'user' : 'bot');
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = message;
        
        messageElement.appendChild(messageContent);
        programmingChatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        programmingChatMessages.scrollTop = programmingChatMessages.scrollHeight;
    }
    
    // Function to get response from Google Gemini API
    async function getProgrammingResponse(query) {
        try {
            const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
            const requestBody = {
                contents: [{
                    parts: [{
                        text: `You are a helpful programming assistant. Answer the following coding question concisely and accurately: ${query}`
                    }]
                }]
            };
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error fetching from Google Gemini API:', error);
            return 'Sorry, I encountered an error. Please try again later.';
        }
    }
    
    // Function to handle sending a message
    async function sendProgrammingMessage() {
        const message = programmingChatInput.value.trim();
        
        if (message) {
            // Add user message
            addProgrammingChatMessage(message, true);
            
            // Clear input
            programmingChatInput.value = '';
            
            // Show thinking indicator
            const thinkingElement = document.createElement('div');
            thinkingElement.classList.add('chatbot-message', 'bot');
            const thinkingContent = document.createElement('div');
            thinkingContent.classList.add('message-content');
            thinkingContent.textContent = 'Thinking...';
            thinkingElement.appendChild(thinkingContent);
            programmingChatMessages.appendChild(thinkingElement);
            programmingChatMessages.scrollTop = programmingChatMessages.scrollHeight;
            
            // Get response from API
            const response = await getProgrammingResponse(message);
            
            // Remove thinking indicator
            programmingChatMessages.removeChild(thinkingElement);
            
            // Add bot response
            addProgrammingChatMessage(response, false);
        }
    }
    
    // Event listeners
    programmingChatSend.addEventListener('click', sendProgrammingMessage);
    
    programmingChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendProgrammingMessage();
        }
    });
}

// Live Chat Widget
if (chatButton && chatBox) {
    // Open chat
    chatButton.addEventListener('click', () => {
        chatBox.style.display = 'block';
    });
    
    // Close chat
    closeChat.addEventListener('click', () => {
        chatBox.style.display = 'none';
    });
    
    // Send message
    function sendMessage() {
        const messageText = chatInput.value.trim();
        
        if (messageText) {
            // Add user message
            const userMessage = document.createElement('div');
            userMessage.classList.add('message', 'user');
            userMessage.innerHTML = `<p>${messageText}</p>`;
            chatMessages.appendChild(userMessage);
            
            // Clear input
            chatInput.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simulate bot response after a delay
            setTimeout(() => {
                const botMessage = document.createElement('div');
                botMessage.classList.add('message', 'bot');
                botMessage.innerHTML = `<p>Thanks for your message! This is a demo chat. In a real implementation, this would connect to a live chat service or chatbot API.</p>`;
                chatMessages.appendChild(botMessage);
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    }
    
    chatSendButton.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Intersection Observer for Animation
const animatedElements = document.querySelectorAll('.vision-card, .service-card, .expertise-card, .stat-item');

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            animationObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Set initial state and observe elements
animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    animationObserver.observe(element);
});

// Preload hero background image
const heroImage = new Image();
heroImage.src = 'images/hero-bg.jpg';

// Create a placeholder hero background if the image doesn't exist
heroImage.onerror = function() {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.style.background = 'linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(10, 10, 10, 0.95))';
    }
};
