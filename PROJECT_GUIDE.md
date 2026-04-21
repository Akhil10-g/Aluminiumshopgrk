# GRK Aluminium Project Guide

This document explains your whole project in simple terms:
- What you built
- Which technologies you used
- Why each technology was used
- How frontend and backend talk to each other
- How image upload and rendering works
- How deployment works on Vercel and Render
- How to debug common issues

## 1) Project Overview

You built a full-stack web application for an aluminium business.

It has two major parts:
- Frontend (React + Vite): user interface, pages, forms, admin screens.
- Backend (Node.js + Express + MongoDB): APIs, database storage, authentication, file uploads.

Main business features:
- Display services with images
- Display projects and materials
- Quote request form
- Admin login
- Admin content management
- File/image upload support

## 2) Tech Stack You Used and Why

### Frontend

React
- What: UI library for component-based web apps.
- Why: Reusable components like Hero, Services, Materials, Navbar, Footer.

Vite
- What: Fast frontend build tool and dev server.
- Why: Very fast local development and simple production build.

Axios
- What: HTTP client.
- Why: Cleaner API calls, interceptors for centralized error handling.

React Router
- What: Client-side routing.
- Why: Multi-page feel (home, projects, admin login) without full page reload.

### Backend

Node.js
- What: JavaScript runtime for server-side code.
- Why: Same language across frontend and backend.

Express
- What: Web framework for Node.js.
- Why: Clean route/controller structure and middleware support.

MongoDB + Mongoose
- What: NoSQL database + ODM.
- Why: Flexible schemas for services, projects, homepage sections, quotes, users.

Multer
- What: Middleware for multipart/form-data file uploads.
- Why: Upload service/project/homepage images to uploads folder.

bcryptjs
- What: Password hashing library.
- Why: Store passwords securely (not plain text) for admin login.

jsonwebtoken
- What: JWT token library.
- Why: Admin authentication for protected API routes.

cors
- What: Cross-Origin Resource Sharing middleware.
- Why: Allow frontend domain to call backend securely.

dotenv
- What: Environment variable loader.
- Why: Keep secrets and config out of source code.

## 3) High-Level Architecture

Browser (User)
-> React Frontend (Vercel)
-> API Requests
-> Express Backend (Render)
-> MongoDB

For images:
- Uploaded by admin to backend
- Stored in backend uploads folder
- Served using static route /uploads
- Frontend renders backend image URL
- If an image fails, frontend shows fallback image

## 4) Folder Structure Meaning

frontend/src/components
- Reusable UI blocks like Services, Materials, Navbar.

frontend/src/pages
- Route-level screens like HomePage, AdminLogin, ManageHomepage.

frontend/src/services/api.js
- Central place for API calls and error normalization.

frontend/src/config/apiConfig.js
- Holds API base URL using env variable.

backend/controllers
- Business logic for each feature.

backend/routes
- URL definitions and middleware hookup.

backend/models
- MongoDB schema definitions.

backend/middleware
- Token verification and file upload middleware.

backend/uploads
- Uploaded images stored here.

backend/server.js
- Main app setup, CORS, routes, static files, DB connection, startup.

## 5) Request Flow Example: Services

Step 1
- Frontend HomePage calls fetchServices from api service.

Step 2
- Request goes to backend endpoint /api/services.

Step 3
- serviceController queries MongoDB Service collection.

Step 4
- Backend returns JSON list.

Step 5
- Services component maps data and renders cards.

Step 6
- Image URL is normalized using toAbsoluteImageUrl.

Step 7
- If image fails to load, onError switches to fallback local image.

## 6) Authentication Flow

Admin login:
- Frontend sends email/password to /api/auth/login.
- Backend validates credentials.
- If valid, backend creates JWT token.
- Frontend stores token in localStorage.
- Protected admin routes send token in Authorization header.
- verifyToken middleware checks token before allowing action.

## 7) Image Upload and Render Flow

Upload:
- Admin submits form-data with image file.
- Multer stores file in uploads folder with unique filename.

Store:
- Backend saves image path/URL in MongoDB record.

Serve:
- express.static exposes /uploads publicly.

Render:
- Frontend receives image string.
- toAbsoluteImageUrl makes sure URL is valid for production.
- Services component fallback avoids broken image UI.

## 8) Environment Variables You Used

Frontend:
- VITE_API_BASE_URL

Backend:
- PORT
- MONGO_URI
- JWT_SECRET
- ADMIN_EMAIL
- ADMIN_PASSWORD
- FRONTEND_URLS (optional extra CORS origins)

Why env variables:
- Different values for local, staging, production.
- Security and flexibility.

## 9) Deployment Setup

Frontend (Vercel)
- Builds with Vite
- Serves static dist output
- Uses VITE_API_BASE_URL for backend URL

Backend (Render)
- Runs Node server
- Connects to MongoDB
- Serves APIs and uploaded files

Important production concept:
- Frontend and backend are different domains.
- CORS must allow frontend domain in backend.

## 10) Issues You Solved During This Project

Multiple default exports / duplicate imports in Services component
- Cause: duplicate code blocks and repeated exports/imports.
- Fix: cleaned component to single export and single import set.

Vercel schema error in vercel.json
- Cause: invalid property envPrefix.
- Fix: removed unsupported property.

Network error / CORS blocked
- Cause: frontend origin not allowed by backend CORS.
- Fix: added correct production domains, including custom domain.

Image not loading in production
- Cause: relative paths or missing default image URL path.
- Fix: robust URL normalization + local fallback image handling.

Invalid credentials
- Cause: login normalization/data mismatch edge cases.
- Fix: hardened auth input normalization and matching logic.

## 11) Why Your Current Setup Is Good

- Clear modular backend architecture (routes/controllers/models)
- Centralized API layer on frontend
- Production-ready CORS handling
- Image fallback strategy avoids broken UI
- Env-driven config supports multiple environments
- JWT-based admin protection

## 12) How to Add New Feature in Future

Recommended steps:
1. Add model in backend/models.
2. Add controller functions in backend/controllers.
3. Add routes in backend/routes.
4. Register route group in backend/server.js.
5. Add API function in frontend/src/services/api.js.
6. Build UI component/page in frontend/src/components or pages.
7. Add validation and fallback UI states.
8. Test locally.
9. Deploy backend then frontend.

## 13) Debug Checklist

If API fails:
- Check frontend console
- Check backend logs on Render
- Verify CORS allowed origin
- Verify VITE_API_BASE_URL
- Verify API endpoint URL

If image fails:
- Open image URL directly in browser
- Check if uploads file exists on backend
- Check DB image value format
- Confirm toAbsoluteImageUrl conversion
- Confirm fallback image works

If auth fails:
- Verify ADMIN_EMAIL and ADMIN_PASSWORD on backend env
- Verify JWT_SECRET exists
- Verify token sent in Authorization header

## 14) Useful Commands

Frontend:
- npm install
- npm run dev
- npm run build

Backend:
- npm install
- npm run dev
- npm start

Git:
- git status
- git add .
- git commit -m "message"
- git push

## 15) Future Improvements You Can Build

- Add refresh tokens and secure httpOnly cookies
- Add role-based admin permissions
- Move uploads to cloud storage (Cloudinary, S3)
- Add image optimization and compression pipeline
- Add server-side input validation layer (Joi/Zod)
- Add automated tests (unit + API integration)
- Add logging/monitoring (Winston + Sentry)

---

If you want, I can also create:
- A short beginner version (2 pages)
- An interview-ready architecture summary
- A step-by-step learning roadmap from this project
