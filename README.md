# New Mobiles Elite - Service Entry Form

A modern, responsive web application for managing service entries in a mobile shop sales and service center with secure authentication.

## Features

- **Simple Authentication**: Easy login system - no server required!
- **Service Entry Form**: Comprehensive form to capture all service details
- **Customer Information**: Name, phone, email, and address
- **Device Information**: Type, brand, model, IMEI, color, and purchase date
- **Service Details**: Service type, priority, problem description, cost estimation
- **Entry Management**: View all service entries with status tracking
- **Reports**: Daily and sales reports with Excel export
- **Local Storage**: All entries are saved in browser's local storage
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## Quick Start (Super Easy!)

### No Installation Required!

1. **Open the Application**
   - Simply double-click `login.html` or open it in any web browser
   - Works on Windows, Mac, Linux - any system with a browser!

2. **Login**
   - Use one of the authorized accounts (see below)
   - After login, you'll access the main service entry form

3. **That's It!**
   - No server setup needed
   - No Node.js installation required
   - Works offline
   - Can be used on any computer

## Login Credentials

The application has two authorized user accounts:

1. **Username**: `newmobiles01` | **Password**: `NM786786`
2. **Username**: `newmobileselite01` | **Password**: `NME786786`

## How to Use

1. **Login**: Open `login.html` and enter your username and password
2. **Access Main App**: After successful login, you'll see the service entry form
3. **Fill Service Entry**: Complete the form with customer and device details
4. **Submit Entry**: Save the entry (stored in browser's local storage)
5. **Manage Entries**: View, update status, delete, or print job sheets
6. **Generate Reports**: Create daily or sales reports and export to Excel
7. **Logout**: Click the logout button in the header when done

## Using on Multiple Systems

### Option 1: Copy Files
- Copy all files to a USB drive or network folder
- Open `login.html` on any computer
- Works on any system - Windows, Mac, or Linux

### Option 2: Network Share
- Place files on a shared network drive
- Access from any computer on the network
- Each computer uses its own browser storage

### Option 3: Cloud Storage
- Upload files to Google Drive, Dropbox, or OneDrive
- Access from any device
- Each device maintains its own data

## Security Features

- **Password Protection**: Only authorized users can access
- **Session Management**: Login expires when browser is closed
- **Protected Routes**: All pages require authentication
- **Secure Storage**: Authentication stored in sessionStorage

## Data Storage

- **Service Entries**: Stored in browser's local storage
- **Authentication**: Stored in session storage (cleared on browser close)
- **Data Persistence**: Data remains until browser data is cleared

## File Structure

```
├── login.html             # Login page (START HERE)
├── index.html             # Main application (protected)
├── script.js              # Main application logic
├── auth.js                # Frontend authentication
├── styles.css             # Application styles
└── README.md              # This file
```

## Browser Compatibility

Works on all modern browsers:
- Chrome (Recommended)
- Firefox
- Safari
- Edge
- Opera

## Troubleshooting

- **Can't login**: Double-check username and password (case-sensitive)
- **Data missing**: Check if browser local storage is enabled
- **Login page not showing**: Make sure you open `login.html` first
- **Print not working**: Check browser print settings

## Notes

- All data is stored locally in your browser
- Each browser/computer has separate data
- To share data between computers, you'll need to export/import
- No internet connection required after initial page load
- Works completely offline

## Support

For issues or questions, check:
- Make sure JavaScript is enabled in your browser
- Try a different browser if issues persist
- Clear browser cache if login page doesn't load properly
