const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'newmobileselite_secret_key_2024_secure'; // In production, use environment variable

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

// Hardcoded users - passwords will be hashed on server start
const users = [
    {
        username: 'newmobiles01',
        password: 'NM786786',
        passwordHash: null
    },
    {
        username: 'newmobileselite01',
        password: 'NME786786',
        passwordHash: null
    }
];

// Hash passwords on server start
async function initializePasswords() {
    for (let user of users) {
        user.passwordHash = await bcrypt.hash(user.password, 10);
        // Remove plain password from memory (security best practice)
        delete user.password;
    }
    console.log('User passwords initialized and hashed successfully');
}

// Initialize passwords before starting server
initializePasswords().then(() => {
    console.log('Authentication system ready');
}).catch(err => {
    console.error('Error initializing passwords:', err);
    process.exit(1);
});

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }
        req.user = user;
        next();
    });
}

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        // Find user
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // Generate JWT token (24 hours expiration)
        const token = jwt.sign(
            { username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token: token,
            username: user.username
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Verify token endpoint
app.get('/api/verify', authenticateToken, (req, res) => {
    res.json({
        success: true,
        username: req.user.username,
        message: 'Token is valid'
    });
});

// Logout endpoint (client-side, but we can add server-side token blacklisting if needed)
app.post('/api/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
});

// Protected route example (for future use)
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

// Serve login page as default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Start server after passwords are initialized
initializePasswords().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log('Login page: http://localhost:3000/login.html');
        console.log('Main app: http://localhost:3000/index.html');
        console.log('Authentication ready - Two users configured');
    });
}).catch(err => {
    console.error('Error initializing passwords:', err);
    process.exit(1);
});

