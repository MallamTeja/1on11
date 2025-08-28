// SkillSync Education Platform - Main JavaScript File

// Utility functions
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} mr-2"></i>
        ${message}
    `;
    
    // Insert at the top of the page
    document.body.insertBefore(alertDiv, document.body.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function showLoading(element, show = true) {
    if (show) {
        element.classList.add('loading');
        const icon = element.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-spinner spinner';
        }
    } else {
        element.classList.remove('loading');
        const icon = element.querySelector('i');
        if (icon) {
            // Restore original icon based on context
            if (element.textContent.includes('Sign')) {
                icon.className = 'fas fa-sign-in-alt';
            } else if (element.textContent.includes('Start')) {
                icon.className = 'fas fa-rocket';
            }
        }
    }
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle (if needed)
    const mobileMenuButton = document.querySelector('[data-mobile-menu]');
    const mobileMenu = document.querySelector('[data-mobile-menu-content]');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Theme management
function initializeTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
        document.documentElement.classList.toggle('dark', prefersDark);
    }
}

// Form handling
function handleFormSubmission(formId, submitHandler) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            await submitHandler(data, form);
        } catch (error) {
            console.error('Form submission error:', error);
            showAlert('An error occurred. Please try again.', 'error');
        }
    });
}

// Login form handler
async function handleLogin(data, form) {
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate inputs
    if (!validateEmail(data.email)) {
        showAlert('Please enter a valid email address.', 'error');
        return;
    }
    
    if (!validatePassword(data.password)) {
        showAlert('Password must be at least 6 characters long.', 'error');
        return;
    }
    
    showLoading(submitButton, true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, accept any valid email/password
    if (data.email && data.password) {
        showAlert('Login successful! Redirecting to dashboard...', 'success');
        
        // Store user session (in real app, this would be handled by backend)
        localStorage.setItem('user', JSON.stringify({
            email: data.email,
            name: data.email.split('@')[0],
            loginTime: new Date().toISOString()
        }));
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    } else {
        showAlert('Invalid credentials. Please try again.', 'error');
    }
    
    showLoading(submitButton, false);
}

// Signup form handler
async function handleSignup(data, form) {
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate inputs
    if (!data.name || data.name.length < 2) {
        showAlert('Please enter a valid name.', 'error');
        return;
    }
    
    if (!validateEmail(data.email)) {
        showAlert('Please enter a valid email address.', 'error');
        return;
    }
    
    if (!validatePassword(data.password)) {
        showAlert('Password must be at least 6 characters long.', 'error');
        return;
    }
    
    if (data.password !== data.confirmPassword) {
        showAlert('Passwords do not match.', 'error');
        return;
    }
    
    showLoading(submitButton, true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    showAlert('Account created successfully! Please sign in.', 'success');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
    
    showLoading(submitButton, false);
}

// Search functionality
function initializeSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchForm || !searchInput || !searchResults) return;
    
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const query = searchInput.value.trim();
        if (!query) return;
        
        searchResults.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner spinner text-2xl text-blue-500"></i><p class="mt-2">Searching...</p></div>';
        
        // Simulate search API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock search results
        const mockResults = [
            {
                title: "Introduction to JavaScript",
                description: "Learn the fundamentals of JavaScript programming language.",
                category: "Programming",
                difficulty: "Beginner",
                duration: "2 hours"
            },
            {
                title: "React.js Fundamentals",
                description: "Master the basics of React.js for building user interfaces.",
                category: "Web Development",
                difficulty: "Intermediate",
                duration: "4 hours"
            },
            {
                title: "Data Structures and Algorithms",
                description: "Essential data structures and algorithms for coding interviews.",
                category: "Computer Science",
                difficulty: "Advanced",
                duration: "8 hours"
            }
        ];
        
        displaySearchResults(mockResults, query);
    });
}

function displaySearchResults(results, query) {
    const searchResults = document.getElementById('searchResults');
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No results found for "${query}"</p>
            </div>
        `;
        return;
    }
    
    const resultsHTML = results.map(result => `
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div class="flex justify-between items-start mb-3">
                <h3 class="text-xl font-semibold text-gray-900">${result.title}</h3>
                <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">${result.category}</span>
            </div>
            <p class="text-gray-600 mb-4">${result.description}</p>
            <div class="flex justify-between items-center">
                <div class="flex space-x-4 text-sm text-gray-500">
                    <span><i class="fas fa-signal mr-1"></i>${result.difficulty}</span>
                    <span><i class="fas fa-clock mr-1"></i>${result.duration}</span>
                </div>
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Start Learning
                </button>
            </div>
        </div>
    `).join('');
    
    searchResults.innerHTML = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Search Results</h2>
            <p class="text-gray-600">Found ${results.length} results for "${query}"</p>
        </div>
        <div class="space-y-6">
            ${resultsHTML}
        </div>
    `;
}

// Dashboard functionality
function initializeDashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.email) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update user info in dashboard
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    
    if (userNameElement) userNameElement.textContent = user.name || 'User';
    if (userEmailElement) userEmailElement.textContent = user.email;
    
    // Logout functionality
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('user');
            showAlert('Logged out successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeNavigation();
    initializeSearch();
    
    // Page-specific initializations
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'login.html':
            handleFormSubmission('loginForm', handleLogin);
            break;
        case 'signup.html':
            handleFormSubmission('signupForm', handleSignup);
            break;
        case 'dashboard.html':
            initializeDashboard();
            break;
    }
});

// Export functions for use in other scripts
window.SkillSync = {
    showAlert,
    showLoading,
    validateEmail,
    validatePassword,
    handleLogin,
    handleSignup
};