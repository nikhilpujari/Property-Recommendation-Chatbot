# Render Deployment Instructions

This guide explains how to deploy this application to Render.

## Prerequisites
- A Render account (https://render.com)
- A PostgreSQL database (you can use Render's Postgres service)

## Step 1: Setup PostgreSQL Service on Render

1. Log in to your Render dashboard
2. Go to "New" > "PostgreSQL"
3. Configure your database:
   - Name: `realestate-chatbot-db` (or your preferred name)
   - Database: `realestate`
   - User: Render will generate a random user
   - Select a region close to your users
   - Choose an appropriate plan
4. Click "Create Database"
5. Once created, make note of the "Internal Database URL" - you will need this for your web service

## Step 2: Deploy Web Service

1. Go to "New" > "Web Service"
2. Connect your GitHub repository
3. Configure your web service:
   - Name: `property-recommendation-chatbot` (or your preferred name)
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `node server_bundle/server/index.js`
   - Select an appropriate plan

4. Add these environment variables:
   - `DATABASE_URL`: paste the "Internal Database URL" from your PostgreSQL service
   - `NODE_ENV`: `production`

5. Add "Advanced" settings:
   - Auto-Deploy: Enable (set to Yes)

6. Click "Create Web Service"

## Step 3: Verify Database Connectivity

After deployment, check logs to make sure the database connection is working:

1. Navigate to your web service in the Render dashboard
2. Click on "Logs"
3. Look for the following messages:
   - `Database connection pool initialized`
   - `Database connection test successful`
   - `Database initialization complete`

If you see these messages, your service is correctly connected to the database.

## Step 4: Connect Frontend to Backend API

If you are hosting the frontend separately (e.g., on Netlify):

1. In your Netlify environment variables, add:
   - `VITE_API_URL`: Set to your Render service URL (e.g., `https://property-recommendation-chatbot.onrender.com`)

## Troubleshooting

### Empty Database Tables

If your API endpoints return empty arrays, the database may not have been seeded. The application includes automatic seeding on startup, but you can manually seed the database:

1. Go to your web service logs in the Render dashboard
2. Look for any database initialization errors
3. Make sure your DATABASE_URL environment variable is correctly set
4. Verify that the web service has permission to access the database

### CORS Issues

If you're experiencing CORS errors:

1. Check that your VITE_API_URL is correctly set in your frontend environment
2. Ensure the backend CORS configuration is allowing requests from your frontend domain

### SSL Connectivity Issues

If you see SSL/TLS errors in the logs:

1. Verify your DATABASE_URL includes `sslmode=require`
2. Check that your database service is properly configured for SSL