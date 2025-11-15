# Location-based Marketplace PoC (Backend)

This is a minimal Proof-of-Concept backend for the location-based dynamic-price marketplace (Clothing niche). It uses **Node.js + Express** with **SQLite** (zero-setup) so you can run and test quickly.

## Features included in this PoC
- Seller registration and profile with GPS coordinates
- Add product, view products
- Update daily price (stores in `daily_prices` and updates `products.current_price`)
- Simple geo-search: `GET /products?lat=<>&lng=<>&radius_km=<>&query=<>&sort=price|distance`
- Favorites and inquiries (basic)
- Seed script to create sample data (5 sellers, ~20 products)

## How to run
1. Download and extract the repo zip.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed sample data:
   ```bash
   npm run seed
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. The server runs at `http://localhost:3000`.

## Important endpoints (PoC)
- `POST /auth/register` — register user (role buyer or seller)
- `POST /auth/login` — login (returns JWT token)
- `POST /sellers` — create seller profile (requires seller user)
- `POST /products` — create product (seller only)
- `GET /products` — geo-search (lat,lng required)
- `POST /products/:id/price` — update price for product (seller only)
- `POST /favorites` — add favorite (buyer only)
- `POST /inquiries` — send inquiry to seller

## Notes
- This is a PoC for demo and testing only. It is not production-ready (no input sanitization, limited auth checks, no rate-limiting).
- For production: migrate to PostgreSQL (+PostGIS), add validations, secure auth, HTTPS, deployment pipeline, and caching (Redis).

