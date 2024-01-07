# Online Academic Certificate Verification System

## Description

This project is an Online Academic Certificate Verification System that allows users to verify the authenticity of academic certificates by uploading an image or PDF. The system uses text extraction techniques, specifically Tesseract, to extract relevant information such as name, hall ticket number, and college name. The extracted details are then verified against a Firebase database to determine the certificate's genuineness.

## Features

- Accepts image or PDF input for certificate verification.
- Utilizes Tesseract for text extraction.
- Verifies certificate details against a Firebase database.

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express
- Tesseract.js
- Firebase

## Setup and Installation

1. Clone the repository:
   git clone https://github.com/your-username/your-repository.git
   
Install dependencies:
cd your-repository
npm install

Configure Firebase:

Create a Firebase project.
Generate a service account key and replace path-to-your-firebase-service-account-key.json in server.js.
Update the databaseURL in server.js with your Firebase database URL.

Run the application:
npm start
The server will start at http://localhost:3000.

Usage
Open the web application in your browser.
Choose a file (image or PDF) for certificate verification.
Click "Verify Certificate" to initiate the verification process.
The extracted text and verification result will be displayed.
