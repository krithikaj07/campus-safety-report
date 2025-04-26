# Project Name: Campus Safety Report

## Description

This project is a web application designed to facilitate the reporting and management of safety-related incidents on a campus. It allows users to submit reports detailing incidents, and provides administrators with the tools to manage and review those reports, including the ability to set user roles.

## Technologies Used

* Frontend:
    * HTML: For structuring web pages
    * CSS: For styling and visual presentation
    * JavaScript: For client-side interactivity
* Backend and Database:
    * Firebase:
        * Cloud Firestore: NoSQL database for storing application data, including user information and safety reports.
        * Cloud Functions: Serverless functions for backend logic, specifically for setting user admin status.
        * Firebase Authentication: For user sign-up, sign-in, and account management.

## Features

* User authentication (sign-up, sign-in)
* Report submission
* Data display and management for reports
* Admin user role management (setting admin status)

## Setup Instructions

1.  Prerequisites:
    * A Google account
    * Node.js and npm installed
    * Firebase CLI installed (`npm install -g firebase-tools`)
2.  Firebase Setup:
    * Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    * Initialize Firebase in your project directory:

        ```bash
        firebase init
        ```

        * Select "Functions" and "Firestore".
        * Choose your Firebase project.
        * Select JavaScript for Cloud Functions.
        * Configure Firestore as needed in the Firebase console.

3.  Cloud Functions Setup:
    * Navigate to the `functions` directory:

        ```bash
        cd functions
        ```

    * Install dependencies:

        ```bash
        npm install
        ```

    * Deploy the Cloud Function:

        ```bash
        firebase deploy --only functions
        ```

4.  Frontend Setup:
    * The frontend files (HTML, CSS, JavaScript) are static assets and can be served using a web server or Firebase Hosting.  Ensure that the JavaScript code is correctly linked to your HTML and that any necessary Firebase libraries are included.

## Deployment

* The application is deployed using the Firebase CLI.
* For the frontend, you can use Firebase Hosting:

        ```bash
        firebase deploy --only hosting
        ```

* For the backend (Cloud Functions) and database, use:

        ```bash
        firebase deploy
        ```

## Project Structure

    ```
    project-root/
    ├── functions/          # Cloud Functions code
    │   ├── index.js        # Main Cloud Functions file (e.g., setAdminStatus)
    │   ├── package.json    # Node.js dependencies for functions
    │   └── ...
    ├── public/             #  Static assets for frontend
    │   ├── index.html
    │   ├── style.css
    │   └── script.js
    ├── firebase.json       # Firebase project configuration
    └── ...
    ```
