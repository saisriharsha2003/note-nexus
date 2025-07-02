# NoteNexus

A **collaborative note-taking application** where users can register, log in, and manage their notes with privacy controls. Users can add, edit, view, and delete notes based on visibility settings (Public/Private). The platform ensures that only note owners can delete their private notes.

---

## Project Overview

**NoteNexus** is designed to simplify collaborative note management with the following key features:
- **User Authentication**: Secure registration and login system.
- **Home Page**: A personalized welcome screen with a navigation bar.
- **Add Notes**: Create notes with visibility options (`Public` or `Private`).
- **View Notes**: Displays public notes from all users and private notes of the current user.
- **Edit and Delete Notes**: Edit or delete notes with ownership-based access control.
- **Responsive Design**: Accessible and user-friendly across devices.
- **Collaborative Notifications**:  
  - Whenever a user creates a note, they receive a confirmation notification with its details.  
  - If the note is marked as **Public**, any user who edits that note becomes a **collaborator**.  
  - All collaborators are automatically notified of subsequent edits.  
  - Notifications are delivered in real-time if collaborators are online, or shown upon next login if they are offline.  
  - This fosters seamless collaboration and keeps all contributors informed of changes.

---


## Directory Stucture

```bash
saisriharsha2003-note-nexus/
├── Readme.md                             # Project documentation explaining how to set up and run the full-stack Note-Nexus app
├── mongo-init/
│   └── init-mongo.sh                     # Shell script to initialize MongoDB users, roles, or collections during container startup
├── note-nexus-backend/
│   ├── index.js                          # Entry point of the Node.js/Express backend server; sets up middlewares and routes
│   ├── nodemon.json                      # Configuration file for nodemon to auto-restart server on code changes
│   ├── package.json                      # Lists all backend dependencies and scripts (start, dev, test etc.)
│   ├── redis.js                          # Connects to Redis server and sets up Pub/Sub channels for real-time notifications
│   ├── controllers/
│   │   └── userController.js             # Contains controller logic for user-related APIs (login, register, etc.)
│   ├── middleware/
│   │   └── verifyJWT.js                  # Middleware to verify JSON Web Tokens for protected backend routes
│   ├── models/
│   │   ├── Note.js                       # Mongoose model/schema defining structure for notes collection in MongoDB
│   │   ├── Notification.js               # Mongoose model/schema for storing persistent notification objects
│   │   └── User.js                       # Mongoose schema/model for user accounts, passwords, and metadata
│   └── routes/
│       └── Routes.js                     # All Express route handlers aggregated and exported here
└── note-nexus-frontend/
    ├── README.md                         # Documentation for the frontend React app (setup, dependencies, scripts)
    ├── index.html                        # HTML template loaded by Vite to bootstrap the React app
    ├── nginx.conf                        # Nginx config file used for serving built frontend in production (reverse proxy, cache)
    ├── package.json                      # Declares all frontend dependencies (React, Vite, Tailwind) and scripts
    ├── postcss.config.js                 # Configuration file for PostCSS plugins (used in TailwindCSS build chain)
    ├── tailwind.config.js                # Tailwind CSS configuration (purge paths, custom themes, etc.)
    ├── vite.config.js                    # Vite config file used for optimizing React app development and builds
    ├── public/
    │   ├── _redirects                    # Redirect rule configuration (commonly used in Netlify deployments)
    │   ├── manifest.json                 # Metadata used for PWA setup and mobile browser integration
    │   └── robots.txt                    # Instructions for web crawlers to allow or disallow indexing
    └── src/
        ├── App.css                       # Global CSS styles for the React application
        ├── App.jsx                       # Root React component defining app-level layout and routing
        ├── App.test.js                   # Jest test file for basic rendering or unit testing of App component
        ├── config.js                     # Contains static configuration values like API URLs or environment flags
        ├── index.css                     # Root CSS imported into the entry point of the app
        ├── index.jsx                     # ReactDOM render file that mounts the app to root DOM node
        ├── reportWebVitals.js           # Optional performance tracking tool for measuring app performance
        ├── setupTests.js                # Initializes test environment (e.g., mocking DOM or APIs for testing)
        ├── assets/
        │   ├── images/
        │   │   ├── delete_emoji.webp     # Emoji image used in delete confirmation or actions
        │   │   └── smile.webp            # Friendly smiley image possibly used for welcome screens
        │   └── styles/
        │       ├── addnote.css           # CSS for AddNote component
        │       ├── change-password.css   # CSS for ChangePassword component
        │       ├── deletenote.css        # CSS for DeleteNote component
        │       ├── edit-profile.css      # CSS for EditProfile component
        │       ├── editnote.css          # CSS for EditNote component
        │       ├── home.css              # CSS for Home component
        │       ├── login.css             # CSS for Login component
        │       ├── main-nav.css          # CSS for MainNav component
        │       ├── main.css              # CSS for Main component
        │       ├── nav.css               # CSS for Nav component
        │       ├── new-password.css      # CSS for NewPassword component
        │       ├── notification.css      # CSS for NotificationsPage or NotificationIcon components
        │       ├── register.css          # CSS for Register component
        │       ├── reset-password.css    # CSS for ResetPassword component
        │       ├── temp.css              # Possibly temporary or unused CSS file
        │       ├── verify-code.css       # CSS for VerifyCode component
        │       ├── viewnote.css          # CSS for ViewNote component
        │       └── viewnotes.css         # CSS for ViewNotes component
        └── components/
            ├── AddNote.jsx              # React component to handle note creation form and logic
            ├── App.jsx                  # Main layout wrapper with routing for different components
            ├── AuthProvider.jsx         # Context provider to manage auth state across the app
            ├── ChangePassword.jsx       # UI and logic for changing user passwords
            ├── DeleteNote.jsx           # Handles deleting a note, includes confirmation and API call
            ├── EditNote.jsx             # Component for editing an existing note
            ├── EditProfile.jsx          # Form to edit user details like name/email/password
            ├── Home.jsx                 # Home dashboard after successful login
            ├── Login.jsx                # Login page UI and logic
            ├── Main.jsx                 # Home Page before logging in to the application
            ├── MainNav.jsx              # Navigation bar visible throughout the main layout
            ├── Nav.jsx                  # Possibly an older or separate nav bar component
            ├── NewPassword.jsx          # Component to enter a new password (e.g., after reset link)
            ├── NotificationIcon.jsx     # Notification bell icon showing unread notification count
            ├── NotificationsPage.jsx    # Full page showing all notifications (paginated or filtered)
            ├── ProtectedLayout.jsx      # Guards routes that require authentication to access
            ├── Register.jsx             # User registration form and logic
            ├── ResetPassword.jsx        # Reset password UI; sends password reset instructions
            ├── VerifyCode.jsx           # OTP/code verification screen used during signup or password reset
            ├── ViewNote.jsx             # Component to view a single note with details
            └── ViewNotes.jsx            # Lists all notes viewable to the user (owned/shared)
```

## Steps to Set Up and Run the Code

### Prerequisites:
Ensure you have the following installed:
  - **Node.js** (v14+ recommended)
  - **MongoDB** (local or hosted)
  - **Redis** (local or hosted)

### 1. Clone the Repository
```bash
git clone "https://github.com/saisriharsha2003/note-nexus"
cd note-nexus
```

### 2. Install Dependencies

Run the following command to install all required packages:

Open two separate terminals and run the following commands:

In the first terminal:

```bash
cd note-nexus-frontend
npm install
```

In the second terminal:


```bash
cd note-nexus-backend
npm install
```
  
### 3. Configuring Environment Variables

Create a .env file in note-nexus-backend with the following values:

```bash
# Redis Config
REDIS_URL=<Your Redis connection string>

# MongoDB Config
MONGODB_URL=<Your MongoDB connection string>

# Email Credentials for Gmail API
EMAIL_USER=<Your Gmail address>
CLIENT_ID=<Your Google API Client ID>
CLIENT_SECRET=<Your Google API Client Secret>
REFRESH_TOKEN=<Your Google OAuth Refresh Token>
REDIRECT_URI=https://developers.google.com/oauthplayground

# JWT Secret
JWT_SECRET=<Your JWT secret key>

```

### 4. Start the Application

Open two separate terminals and run the following commands:

In the first terminal:

```bash
cd note-nexus-frontend
npm start
```

In the second terminal:

```bash
cd note-nexus-backend
npm start
```

### 5. Access the Application

Open http://localhost:3000 in your browser to use the app.

---

## Dependencies and Prerequisites

Backend:

- **`Node.js`**: JavaScript runtime for server-side logic.
- **`Express.js`**: Web framework for the backend.
- **`MongoDB`**: Database for storing user and note data.
- **`Mongoose`**: ODM for MongoDB.
- **`JWT`**: Authentication via JSON Web Tokens.

Frontend:

- **`React.js`**: Frontend framework for the user interface.
- **`Tailwind CSS`**: Styling framework for consistent and responsive design.

---


> ℹ️ **Looking for the non-Docker version?**  
> Check out the [`deploy`](https://github.com/saisriharsha2003/note-nexus/tree/main) branch for instructions on running the app with Docker.

