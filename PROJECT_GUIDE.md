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

c
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

## 16) Interview-Ready Version

If you need to explain this project in an interview, keep it simple:

“This is a full-stack aluminium business website built with React and Vite on the frontend, and Node.js, Express, and MongoDB on the backend. It supports services, projects, materials, quote requests, admin login, and image uploads. The frontend talks to the backend through REST APIs, JWT protects admin routes, and uploaded images are served from the backend with fallback handling on the frontend.”

## 17) Important Code You May Be Asked To Write

### A) Express server setup with CORS, routes, and static uploads

```js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URLS?.split(',') || true, credentials: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);

export default app;
```

What interviewers check:
- Do you know how to enable CORS?
- Can you serve uploaded files statically?
- Do you understand route modularization?

### B) JWT auth middleware

```js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'No token provided' });
	}

	try {
		const token = authHeader.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(403).json({ message: 'Invalid or expired token' });
	}
};
```

What interviewers check:
- Can you protect admin-only routes?
- Do you know how to read headers and validate tokens?

### C) Mongoose model example

```js
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		image: { type: String, required: true },
	},
	{ timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
```

What interviewers check:
- Can you define schema fields and validation?
- Do you know why timestamps are useful?

### D) Controller pattern for fetching data

```js
import Service from '../models/Service.js';

export const getServices = async (req, res) => {
	try {
		const services = await Service.find().sort({ createdAt: -1 });
		res.json(services);
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch services' });
	}
};
```

What interviewers check:
- Can you write async controller logic?
- Do you handle errors properly?

### E) Multer upload setup

```js
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'uploads/'),
	filename: (req, file, cb) => {
		const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, uniqueName + path.extname(file.originalname));
	},
});

export const upload = multer({ storage });
```

What interviewers check:
- Can you handle file uploads?
- Do you know how to avoid filename collisions?

### F) Frontend API call with axios

```js
import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchServices = async () => {
	const response = await api.get('/api/services');
	return response.data;
};
```

What interviewers check:
- Do you centralize API calls?
- Do you know how environment variables work in Vite?

### G) React image fallback pattern

```jsx
const ServiceCard = ({ service }) => {
	const handleImageError = (event) => {
		event.currentTarget.src = '/images/fallback-service.jpg';
	};

	return <img src={service.image} alt={service.title} onError={handleImageError} />;
};
```

What interviewers check:
- Can you make the UI resilient?
- Do you handle broken image URLs gracefully?

## 18) Questions They May Ask You

### Project questions
- What problem does your app solve?
- Why did you choose React, Express, and MongoDB?
- How do the frontend and backend communicate?
- How do you handle image uploads?
- How is admin authentication implemented?
- What happens if an uploaded image is missing in production?
- Why did you use JWT instead of sessions?
- How did you solve CORS issues?

### Coding questions they may ask you to write
- Create a REST API route and controller for getting services.
- Write a Mongoose schema for a project or service.
- Write middleware to verify a JWT token.
- Write a Multer configuration for file uploads.
- Write a React component that fetches API data and handles loading/error states.
- Write an image fallback handler in React.
- Write a login API that checks credentials and returns a token.

### Backend questions
- What is the difference between controller, route, and middleware?
- Why do you use `async/await` with `try/catch`?
- How do you protect admin-only endpoints?
- How do you serve static image files from Express?

### Frontend questions
- Why use a central API service file?
- How do environment variables work in Vite?
- How do you handle errors in UI?
- How do you prevent broken images from affecting the layout?

## 19) Best Short Answers In Interviews

- `Routes` decide the URL.
- `Controllers` contain the business logic.
- `Middleware` runs before the controller for tasks like auth and uploads.
- `Mongoose` defines the database structure.
- `JWT` keeps admin authentication stateless.
- `Multer` handles file uploads.
- `CORS` allows the frontend domain to talk to the backend.

## 20) What To Say If They Ask For Your Strongest Part

You can say:

“My strongest part is connecting the UI to the API cleanly. I designed the frontend to handle loading, errors, and image fallback, and the backend to keep authentication, uploads, and data models separated so the app stays maintainable.”
