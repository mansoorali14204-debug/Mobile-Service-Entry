# New Mobiles Elite - Service Entry Form

A modern, responsive web application for managing service entries in a mobile shop sales and service center with secure authentication.

## Features

- **Secure Authentication**: Login system with JWT tokens
- **Service Entry Form**: Comprehensive form to capture all service details
- **Customer Information**: Name, phone, email, and address
- **Device Information**: Type, brand, model, IMEI, color, and purchase date
- **Service Details**: Service type, priority, problem description, cost estimation
- **Entry Management**: View all service entries with status tracking
- **Reports**: Daily and sales reports with Excel export
- **Local Storage**: All entries are saved in browser's local storage
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   Or:
   ```bash
   node server.js
   ```

3. **Access the Application**
   - Open your browser and go to: `http://localhost:3000`
   - You will be redirected to the login page

## Login Credentials

The application has two authorized user accounts:

1. **Username**: `newmobiles01` | **Password**: `NM786786`
2. **Username**: `newmobileselite01` | **Password**: `NME786786`

## How to Use

1. **Login**: Enter your username and password on the login page
2. **Access Main App**: After successful login, you'll be redirected to the service entry form
3. **Fill Service Entry**: Complete the form with customer and device details
4. **Submit Entry**: Save the entry to local storage
5. **Manage Entries**: View, update status, delete, or print job sheets
6. **Generate Reports**: Create daily or sales reports and export to Excel
7. **Logout**: Click the logout button in the header when done

## Form Fields

### Customer Information
- Customer Name (required)
- Phone Number (required)
- Email Address
- Address

### Device Information
- Device Type (required)
- Brand (required)
- Model (required)
- IMEI Number
- Color
- Purchase Date

### Service Information
- Service Type (required)
- Priority (required)
- Problem Description (required)
- Estimated Cost
- Advance Amount
- Entry Date (required)
- Expected Delivery Date
- Status (required)
- Technician Notes

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Passwords are hashed using bcrypt
- **Session Management**: Tokens expire after 24 hours
- **Protected Routes**: All pages require authentication
- **Secure Storage**: Tokens stored in sessionStorage (cleared on browser close)

## Data Storage

All service entries are stored in the browser's local storage. To clear all data, you can use browser's developer tools or clear browser data.

## Server Configuration

The server runs on port 3000 by default. To change the port, edit the `PORT` constant in `server.js`.

## File Structure

```
├── server.js              # Express server with authentication
├── package.json           # Node.js dependencies
├── login.html             # Login page
├── index.html             # Main application (protected)
├── script.js              # Main application logic
├── auth.js                # Frontend authentication utilities
├── styles.css             # Application styles
└── README.md              # This file
```

## Troubleshooting

- **Cannot login**: Make sure the server is running (`node server.js`)
- **Token expired**: Logout and login again
- **Connection error**: Check if server is running on port 3000
- **Port already in use**: Change the PORT in server.js or stop the process using port 3000



