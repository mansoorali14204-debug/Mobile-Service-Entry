// Frontend Authentication Utilities

const auth = {
    // Get token from sessionStorage
    getToken() {
        return sessionStorage.getItem('authToken');
    },

    // Set token in sessionStorage
    setToken(token) {
        sessionStorage.setItem('authToken', token);
    },

    // Remove token from sessionStorage
    removeToken() {
        sessionStorage.removeItem('authToken');
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    },

    // Get authorization header for API requests
    getAuthHeader() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    // Verify token with server
    async verifyToken() {
        const token = this.getToken();
        if (!token) {
            return false;
        }

        try {
            const response = await fetch('/api/verify', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.success === true;
            }
            return false;
        } catch (error) {
            console.error('Token verification error:', error);
            return false;
        }
    },

    // Logout user
    async logout() {
        try {
            const token = this.getToken();
            if (token) {
                await fetch('/api/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.removeToken();
            window.location.href = 'login.html';
        }
    },

    // Check authentication and redirect if not authenticated
    async requireAuth() {
        const isAuth = this.isAuthenticated();
        if (!isAuth) {
            window.location.href = 'login.html';
            return false;
        }

        // Verify token with server
        const isValid = await this.verifyToken();
        if (!isValid) {
            this.removeToken();
            window.location.href = 'login.html';
            return false;
        }

        return true;
    }
};

