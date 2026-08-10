# HouseRent — Full-Stack MERN Property Rental Platform

A production-ready house rental web application built with MongoDB, Express.js, React.js, and Node.js. Users can browse, search, and book rental properties; owners can list properties for admin approval; admins manage users, listings, and bookings from a dedicated dashboard.

---

## 1. Tech Stack

**Frontend:** React 18, React Router DOM, Axios, Bootstrap 5, React Context API, Chart.js
**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Auth:** JWT + bcryptjs, httpOnly cookies
**Security:** Helmet, CORS, express-rate-limit, express-mongo-sanitize, xss-clean, express-validator
**File Uploads:** Multer

---

## 2. Folder Structure

```
House-Rent/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Navbar, Footer, PropertyCard, Filters, Pagination, etc.
│   │   ├── pages/            # Home, Properties, Dashboard, AdminDashboard, etc.
│   │   ├── layouts/          # MainLayout (navbar + footer wrapper)
│   │   ├── context/          # AuthContext (global auth state)
│   │   ├── hooks/             # useAuth
│   │   ├── services/          # Axios API calls (auth, property, booking, admin)
│   │   └── styles/            # Custom CSS
│   └── vite.config.js
│
├── server/                  # Express backend
│   ├── config/               # DB connection, seedAdmin script
│   ├── controllers/          # Business logic for auth, property, booking, admin
│   ├── middleware/            # JWT auth, admin guard, multer upload, error handler
│   ├── models/                 # User, Property, Booking (Mongoose schemas)
│   ├── routes/                  # /api/auth, /api/properties, /api/bookings, /api/admin
│   ├── validators/              # express-validator rule sets
│   ├── uploads/                  # Uploaded property/profile images (gitignored)
│   └── app.js                     # Express entry point
│
└── package.json              # Root scripts to run both apps concurrently
```

---

## 3. Database Design

**Users:** fullname, email, password (hashed), phone, address, profileImage, role (User/Admin), isBlocked, timestamps
**Properties:** title, description, price, location, city, state, propertyType, bedrooms, bathrooms, parking, furnishing, area, amenities[], images[], owner (ref User), status (Pending/Approved/Rejected), timestamps
**Bookings:** property (ref), user (ref), owner (ref), bookingDate, moveInDate, paymentStatus, bookingStatus, timestamps

---

## 4. Installation & Setup

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)
- npm

### Steps

```bash
# 1. Extract/clone the project, then from the root:
npm run install-all
# This installs root, server, and client dependencies in one go.

# 2. Configure environment variables
cd server
cp .env.example .env
# Edit .env and fill in MONGO_URI and JWT_SECRET at minimum

# 3. (Optional) Seed an admin account
node config/seedAdmin.js
# Creates admin@houserent.com / Admin@12345 (or your ADMIN_EMAIL/ADMIN_PASSWORD env vars)
# Change this password immediately after first login.

# 4. Run both frontend and backend together (from the project root)
cd ..
npm run dev
```

This starts:
- Backend on **http://localhost:5000**
- Frontend on **http://localhost:5173** (Vite dev server proxies `/api` and `/uploads` to the backend — no CORS issues in dev)

To run them separately: `npm run server` and `npm run client` in separate terminals.

---

## 5. Environment Variables (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Backend port (default 5000) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string used to sign JWTs |
| `JWT_EXPIRE` | Token lifetime, e.g. `7d` |
| `JWT_COOKIE_EXPIRE` | Cookie lifetime in days |
| `CLIENT_URL` | Frontend origin, for CORS (e.g. your Vercel URL in production) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used only by `seedAdmin.js` |

---

## 6. API Documentation

All endpoints are prefixed with `/api`. Protected routes require an `Authorization: Bearer <token>` header (the frontend also relies on an httpOnly cookie automatically).

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login, returns JWT + user |
| POST | `/auth/logout` | Private | Clears auth cookie |
| GET | `/auth/profile` | Private | Get current user profile |
| PUT | `/auth/profile` | Private | Update profile (multipart, supports `profileImage`) |
| PUT | `/auth/change-password` | Private | Change password |

### Properties
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/properties` | Public | List approved properties. Query params: `city, location, minPrice, maxPrice, propertyType, bedrooms, bathrooms, furnishing, parking, sort, page, limit, q` |
| GET | `/properties/:id` | Public | Single property details |
| GET | `/properties/my/listings` | Private | Current user's own listings |
| POST | `/properties` | Private | Create listing (multipart, `images` field, up to 10) |
| PUT | `/properties/:id` | Private | Update listing (owner or admin only) |
| DELETE | `/properties/:id` | Private | Delete listing (owner or admin only) |

### Bookings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/bookings` | Private | Create a booking request |
| GET | `/bookings` | Private | Get bookings (as tenant and as owner) |
| PUT | `/bookings/:id` | Private | Update booking/payment status |
| DELETE | `/bookings/:id` | Private | Cancel a booking |

### Admin (all require Admin role)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/dashboard` | Aggregate stats + monthly analytics |
| GET | `/admin/users` | List all users |
| PUT | `/admin/users/:id` | Block/unblock a user (`{ isBlocked: true/false }`) |
| DELETE | `/admin/users/:id` | Delete a user |
| GET | `/admin/properties` | List properties, optional `?status=Pending` |
| PUT | `/admin/properties/:id/approve` | Approve a listing |
| PUT | `/admin/properties/:id/reject` | Reject a listing |
| DELETE | `/admin/properties/:id` | Delete any property |
| GET | `/admin/bookings` | List all bookings |

---

## 7. Security Implemented

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT auth via Authorization header and httpOnly cookie
- Helmet for secure HTTP headers
- CORS restricted to the configured `CLIENT_URL`
- express-mongo-sanitize to block NoSQL injection
- xss-clean to sanitize user input
- express-validator on all write endpoints
- Rate limiting: 300 req/15min globally, 20 req/15min on login/register
- Centralized error handler (no stack traces leaked to clients)

---

## 8. Deployment Guide

### Database — MongoDB Atlas
1. Create a free cluster at mongodb.com/atlas.
2. Add a database user and whitelist `0.0.0.0/0` (or your host's IP) under Network Access.
3. Copy the connection string into `MONGO_URI`.

### Backend — Render
1. Push the `server/` folder (or the whole repo) to GitHub.
2. On Render: New → Web Service → connect the repo.
3. Root directory: `server`. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables from your `.env` in Render's dashboard (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, etc.), setting `CLIENT_URL` to your deployed frontend URL.
5. Render provides a public URL like `https://houserent-api.onrender.com`.

### Frontend — Vercel
1. Push the `client/` folder to GitHub (or same repo, different root).
2. On Vercel: New Project → import repo → root directory `client`.
3. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
4. Since the client uses a relative `/api` path with a dev-only proxy, add a production rewrite: create `client/vercel.json`:
   ```json
   {
     "rewrites": [{ "source": "/api/:path*", "destination": "https://your-render-backend-url.onrender.com/api/:path*" }]
   }
   ```
5. Deploy. Update the backend's `CLIENT_URL` env var to match your final Vercel URL.

---

## 9. Testing Checklist

- [ ] Register / login / logout / protected route redirects
- [ ] Profile update with image upload, password change
- [ ] Create/edit/delete property listing with image upload; verify status resets to Pending on edit
- [ ] Search & filter (city, price range, bedrooms, furnishing, parking) + pagination
- [ ] Booking creation, owner confirmation, tenant/owner cancellation
- [ ] Admin: approve/reject property, block/delete user, dashboard analytics chart renders
- [ ] Role authorization: non-admin blocked from `/admin` routes (both UI redirect and API 403)
- [ ] Responsive layout on mobile widths

---

## 10. Notes

- Uploaded images are stored on local disk under `server/uploads` and served at `/uploads/<filename>`. For production at scale, consider swapping this for S3/Cloudinary.
- The contact form on the Contact page is currently front-end only (toast confirmation); wire it to a real `/api/contact` endpoint + email service if needed.
- First registered users are role `User` by default — use `seedAdmin.js` or manually update a user's `role` field in MongoDB to `Admin`.

---

## 11. Resources & Assets

- **Google Drive Folder:** [Project Resources & Media](https://drive.google.com/drive/folders/1UO8J_wljD-ssBGZ3zHGotVznUc701BG5?usp=drive_link)

#   H o u s e - R e n t  
 