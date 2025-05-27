# Wealth Creation & Leadership Conference Registration

A responsive web application for managing registrations for the "Secrets to Wealth Creation & Leadership in the Marketplace Conference" in London featuring Dr. Cindy Trimm.

<!-- Updated for Netlify deployment -->

## Overview

This project provides an elegant, user-friendly registration system for conference attendees. The application collects participant information and stores it securely in Firebase Firestore, allowing event organizers to efficiently manage registrations.

## Features

- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop devices
- **Form Validation**: Client-side validation ensures all required fields are completed correctly
- **Real-time Data Storage**: Firebase Firestore integration for secure, real-time data storage
- **Alternative Form Submission**: Formspree integration as a backup submission method
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
  - Firebase Firestore (primary data storage)
  - Formspree (alternative form submission)

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

### Formspree Configuration (Alternative)

For Formspree integration:

1. Sign up at [formspree.io](https://formspree.io/)
2. Create a new form and get your form ID
3. Replace the placeholder in the form action attribute:
   ```html
   <form id="registrationForm" action="https://formspree.io/f/your-formspree-id" method="POST">
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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and owned by Suzzy Ltd. All rights reserved.

---

&copy; 2025 Suzzy Ltd | All Rights Reserved
