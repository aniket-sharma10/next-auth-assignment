# Next.js Authentication Application

This repository contains a Next.js application that implements basic authentication using NextAuth.js. The application supports both Google Login and Email-based OTP authentication, role-based access control, and a responsive user interface.


## Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aniket-sharma10/next-auth-assignment
   cd next-auth-assignment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   
   NEXTAUTH_SECRET=<your-nextauth-secret>
   NEXTAUTH_URL = http://localhost:3000

   MONGODB_URI=<your-mongodb-connection-string>

   SMTP_HOST=<your-email-smtp-host>
   SMTP_PORT=<your-email-smtp-port>
   SMTP_USER=<your-email-username>
   SMTP_PASSWORD=<your-email-password>
   SMTP_FROM=<your-email-username>
   ```

### Running the Application Locally

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

---

## Deployment

The application is deployed on **Vercel**.

### Live Demo
[Deployed App URL](<deployed-url>)

---

## Instructions for Developers

### Scripts
- `npm run dev`: Starts the development server.


### Authentication Flow
- **Google Login:**
  - Integrates Google OAuth through `next-auth/providers/google`.
- **Email-based OTP:**
  - User enters an email and receives an OTP via Nodemailer.
  - OTP is verified against MongoDB records with expiration handling.

### Role-based Access Control
- Role is stored in the `User` model in MongoDB.
- Admin-only pages(Dashboard) are restricted based on user roles.

### Email Service
- Uses Nodemailer with an SMTP server to send OTP emails.
