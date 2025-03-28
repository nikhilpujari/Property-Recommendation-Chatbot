# Real Estate Chatbot - Server Bundle

This folder contains all the server-side code needed to run the backend for the Real Estate Chatbot application.

## Files and Directories

- `server/` - Server implementation
  - `index.ts` - Main server entry point
  - `routes.ts` - API route definitions
  - `storage.ts` - Data storage and persistence
  - `vite.ts` - Vite server integration
  - `services/` - External services integration
    - `googleSheets.ts` - Google Sheets API integration for lead tracking
- `shared/` - Shared code between client and server
  - `schema.ts` - Type definitions and database schemas
- `drizzle.config.ts` - Database configuration 
- `package.json` - Project dependencies
- `tsconfig.json` - TypeScript configuration

## Environment Variables

You will need to set up the following environment variables on your hosting platform:

```
GOOGLE_SHEETS_API_KEY=your_api_key
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email
GOOGLE_SHEETS_PRIVATE_KEY=your_private_key
GOOGLE_SHEET_ID=your_sheet_id
```

## Deployment Instructions

### 1. Choose a Hosting Platform

Choose a Node.js-compatible hosting platform like:
- Vercel
- Render
- Digital Ocean App Platform
- AWS (Lambda or EC2)
- Heroku

### 2. Update CORS Configuration

In `server/index.ts`, update the CORS settings to allow requests from your frontend domain:

```typescript
app.use(cors({
  origin: ['https://your-frontend-domain.com', 'http://localhost:3000']
}));
```

### 3. Configure Ports

Most hosting platforms will provide a PORT environment variable. Update the server to use this port:

```typescript
const PORT = process.env.PORT || 5000;
```

### 4. Install Dependencies and Start

```bash
npm install
npm start
```

The default start script defined in package.json is `tsx server/index.ts`.

### 5. Update Frontend Configuration

After deploying the server, update the frontend configuration in `client/src/lib/config.ts`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-new-backend-url.com';
```

And update the VITE_API_URL environment variable in your Netlify settings to point to the new backend URL.

## Google Sheets Integration

The server integrates with Google Sheets to track customer leads. Make sure:

1. The service account (GOOGLE_SHEETS_CLIENT_EMAIL) has "Editor" access to the Google Sheet
2. The Google Sheet has the appropriate columns: Name, Contact, Interest, Timestamp, PropertyInterest, LocationInterest, BudgetRange, Notes