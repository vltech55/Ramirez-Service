## Service Map App

React + TypeScript app that visualizes service clients on Google Maps with clustering, status color pins, an optional optimized route, a distance matrix, and a nearby clients list.

### Features
- Map with pins color-coded by status (Active, Paused, Cancelled)
- Marker clustering and client info window
- Sidebar with filters and multi-select for route optimization
- Distance Matrix table highlighting the nearest destination per origin
- Nearby Clients list for quick scheduling decisions

### Setup
1. Create `.env` in the project root with:
   ```
   VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
   ```
   Enable APIs in Google Cloud: Maps JavaScript API, Directions API, Distance Matrix API.

2. Install and run:
   ```
   npm install
   npm run dev
   ```

3. Open the app: `http://localhost:5173`

### Notes
- The sample data in `src/data/sampleClients.ts` includes approximate lat/lngs for Miami area addresses. Replace with your real client data. If you only have addresses, add a small backend or one-time script to geocode with Places/Geocoding API.
- For production, proxy Distance Matrix and Directions requests through your server to keep the API key secure and apply caching.


