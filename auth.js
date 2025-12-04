// Frontend Authentication Utilities (No Server Required)

// Hardcoded users - simple authentication
const AUTH_USERS = {
    'newmobiles01': 'NM786786',
    'newmobileselite01': 'NME786786'
};

const auth = {
    // Get authentication status from sessionStorage
    getAuthStatus() {
        return sessionStorage.getItem('isAuthenticated') === 'true';
    },

    // Set authentication status
    setAuthStatus(status) {
        sessionStorage.setItem('isAuthenticated', status ? 'true' : 'false');
    },

    // Store username
    setUsername(username) {
        sessionStorage.setItem('username', username);
    },

    // Get username
    getUsername() {
        return sessionStorage.getItem('username');
    },

    // Check if user is authenticated
    isAuthenticated() {
        return this.getAuthStatus();
    },

    // Login function - checks username and password
    login(username, password) {
        // Check if user exists and password matches
        if (AUTH_USERS[username] && AUTH_USERS[username] === password) {
            this.setAuthStatus(true);
            this.setUsername(username);
            return { success: true, username: username };
        }
        return { success: false, error: 'Invalid username or password.' };
    },

    // Logout user
    logout() {
        this.setAuthStatus(false);
        sessionStorage.removeItem('username');
        window.location.href = 'login.html';
    },

    // Check authentication and redirect if not authenticated
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
};
