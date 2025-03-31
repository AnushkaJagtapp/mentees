// auth.js - Complete Authentication Handler
document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode') || 'login';
    
    // DOM Elements
    const authHeader = document.getElementById('auth-header');
    const authSubmit = document.getElementById('auth-submit');
    const toggleLink = document.getElementById('toggle-link');
    const authToggle = document.getElementById('auth-toggle');
    
    // Initialize view based on mode
    if (mode === 'signup') {
        authHeader.textContent = 'Create Account';
        authSubmit.textContent = 'Sign Up';
        toggleLink.textContent = 'Login';
        authToggle.innerHTML = 'Already have an account? <a href="#" id="toggle-link">Login</a>';
    } else {
        authHeader.textContent = 'Login';
        authSubmit.textContent = 'Login';
        toggleLink.textContent = 'Sign Up';
        authToggle.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-link">Sign up</a>';
    }
    
    // Toggle between login/signup
    document.getElementById('toggle-link').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = `auth.html?mode=${mode === 'login' ? 'signup' : 'login'}`;
    });
    
    // Handle form submission
    authSubmit.addEventListener('click', handleAuth);
    
    // Load existing users or initialize empty array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    function handleAuth() {
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value.trim();
        
        // Basic validation
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        if (mode === 'login') {
            // Login logic
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                alert('Invalid credentials. Please try again.');
            }
        } else {
            // Signup logic
            if (users.some(u => u.email === email)) {
                alert('Email already exists. Please login instead.');
                return;
            }
            
            const newUser = {
                email,
                password,
                tests: [],
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            alert('Account created successfully!');
            window.location.href = 'index.html';
        }
    }
    
    // Optional: Press Enter to submit
    document.getElementById('auth-password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleAuth();
        }
    });
});