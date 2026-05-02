# OneHood

OneHood is a comprehensive community platform that brings neighborhoods together. It features a robust social feed, event management, a local marketplace, and a full administrative dashboard for community managers.

## 🌟 Key Features

* **Social Feed:** Connect with your neighbors, share updates, and engage with posts in real-time.
* **Community Events:** Discover, RSVP, and manage local events.
* **Marketplace:** Buy, sell, or trade items within your community.
* **Admin Dashboard:** A dedicated space for community admins with full CRUD (Create, Read, Update, Delete) privileges to manage users, posts, events, and marketplace listings securely.
* **Secure Authentication:** Built-in JWT-based authentication and secure password hashing.
* **Media Uploads:** Seamless image and media handling using Cloudinary.

## 🛠️ Technology Stack

**Frontend:**
* [React 19](https://react.dev/)
* [Vite](https://vitejs.dev/) - Lightning fast build tool
* [React Router](https://reactrouter.com/) - Navigation and routing
* [Mantine UI](https://mantine.dev/) - Premium UI components and theme support
* [Tabler Icons](https://tabler-icons.io/)

**Backend:**
* [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) - Database and ORM
* [JSON Web Tokens (JWT)](https://jwt.io/) - Secure session management
* [BcryptJS](https://www.npmjs.com/package/bcryptjs) - Password encryption
* [Cloudinary](https://cloudinary.com/) & [Multer](https://www.npmjs.com/package/multer) - Media and file upload handling

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
* Node.js (v18 or higher recommended)
* MongoDB (Local instance or MongoDB Atlas URI)
* A Cloudinary account for media storage

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd OneHood
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   * Create a `.env` file in the `backend` directory with the following variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloudinary_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   * Create a `.env` file in the `frontend` directory if you have any frontend-specific variables (like API base URL).

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm start
   ```
   *The server will typically run on `http://localhost:5000`.*

2. **Start the Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```
   *The application will typically be accessible at `http://localhost:5173`.*

## 📂 Project Structure

```
OneHood/
├── backend/            # Express server, MongoDB models, API routes, controllers
└── frontend/           # React application, Vite config, UI components, pages
```
