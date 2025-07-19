# Wealth Creation & Leadership Conference Registration

A responsive web application for managing registrations for the "Secrets to Wealth Creation & Leadership in the Marketplace Conference" in London featuring Dr. Cindy Trimm.

<!-- Updated for Netlify deployment -->

## Overview

This project provides an elegant, user-friendly registration system for conference attendees. The application collects participant information and stores it securely in Firebase Firestore, allowing event organizers to efficiently manage registrations.

## Features

- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop devices
- **Form Validation**: Client-side validation ensures all required fields are completed correctly
- **Real-time Data Storage**: Firebase Firestore integration for secure, real-time data storage
- **Secure Data Storage**: Firebase Firestore integration for reliable data management
- **Modern UI**: Clean, professional interface with elegant animations and color scheme
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Technology Stack

- **Frontend**:
  - HTML5
  - CSS3 (with CSS Variables and Flexbox/Grid layouts)
  - JavaScript (ES6+)
  - Google Fonts (Playfair Display, Poppins)
  - Font Awesome 6.4.0

- **Backend/Storage**:
  - Firebase Firestore (secure cloud database)
  - Real-time data synchronization

- **Deployment**:
  - Netlify (configured for deployment)

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/peteroluoch/WealthFormLondon.git
   ```

2. Navigate to the project directory:
   ```
   cd WealthFormLondon
   ```

3. Open `index.html` in your browser to view the site locally.

### Firebase Configuration

The project uses Firebase for data storage. To set up your own Firebase instance:

1. Create a Firebase account and project at [firebase.google.com](https://firebase.google.com/)
2. Set up Firestore in your Firebase project
3. Replace the Firebase configuration in `index.html` with your own:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

### Firebase Security Rules

Configure Firestore security rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /registrations/{document} {
      allow write: if true; // Allow form submissions
      allow read: if false; // Restrict reading for privacy
    }
  }
}
```

## Usage

The registration form collects the following information from attendees:
- Personal details (name, title, email, phone)
- Church/Organization affiliation
- Payment information

Form submissions are stored in Firebase Firestore in the 'registrations' collection, making it easy for administrators to access and manage registration data.

## Deployment

The site is configured for deployment on Netlify. To deploy:

1. Create a Netlify account at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Configure build settings (not required for static HTML)
4. Deploy the site

## Local Development (Production-Ready)

To run your app locally in a way that exactly matches production, use the provided PowerShell script for a robust, automated workflow:

### 1. Prerequisites
- Ensure you have **Node.js** and **npm** installed.
- Your `.env` file should be in the project root with your Stripe keys and any other required environment variables.

### 2. Start the Local Dev Environment

From your project root, run:
```
./dev.ps1
```

This script will:
- Check for Node.js, npm, and **pm2** (installs pm2 globally if missing)
- Check and install npm dependencies only if needed (uses cache otherwise)
- Start your backend server with pm2 in watch mode (auto-restarts on code changes)
- Serve your frontend from the `public/` directory on [http://localhost:3000](http://localhost:3000)
- Open your browser automatically
- Print helpful pm2 commands for logs, stop, delete, and list

### 3. Stopping and Managing the Server
- To see logs:   `pm2 logs wealth-server`
- To stop:       `pm2 stop wealth-server`
- To delete:     `pm2 delete wealth-server`
- To list:       `pm2 list`

### 4. Workflow Notes
- All API calls (e.g., `/api/register`, `/api/create-payment`) use relative URLs and work locally and in production with no code changes.
- No CORS issues, as both frontend and backend are served from the same Express app.
- When you change dependencies or code, the script and pm2 will handle updates and restarts automatically.
- When ready, commit and push—Railway will deploy the same code and everything will work live.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---
&copy; 2025 Suzzy Ltd | All Rights Reserved 
---

Developed by Codegx Technologies

Test commit to verify git push on railway-deploy branch.
