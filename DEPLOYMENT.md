# Deployment Guide - Lakshmi Collections

This guide covers deploying your e-commerce application to production.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Database Setup](#database-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)

---

## Prerequisites

Before deploying, ensure you have:
- [ ] GitHub repository with latest code
- [ ] Supabase account (for database)
- [ ] Razorpay live account with activated payment methods
- [ ] Domain name (optional but recommended)
- [ ] Vercel/Netlify account (for frontend)
- [ ] Render/Railway account (for backend)

---

## Database Setup

### Option 1: Supabase (Recommended)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Choose organization and set project name
   - Set a strong database password
   - Select region closest to your users

2. **Run Database Migrations**
   ```bash
   # Navigate to backend folder
   cd backend/supabase
   
   # Copy the SQL from final_schema.sql
   # Paste and run in Supabase SQL Editor
   ```

3. **Get Connection String**
   - Go to Project Settings → Database
   - Copy the connection string (URI format)
   - Replace `[YOUR-PASSWORD]` with your database password

4. **Run Seed Data (Optional)**
   ```sql
   -- Run seed.sql in Supabase SQL Editor to add sample products
   ```

---

## Backend Deployment

### Option 1: Render (Recommended)

1. **Create New Web Service**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

2. **Configure Service**
   ```
   Name: lakshmi-collections-api
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

3. **Add Environment Variables**
   ```
   DATABASE_URL=your_supabase_connection_string
   JWT_SECRET=your_random_secret_key_here
   RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   PORT=5000
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the service URL (e.g., https://lakshmi-collections-api.onrender.com)

### Option 2: Railway

1. **Create New Project**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure**
   - Set root directory to `backend`
   - Add environment variables (same as above)
   - Deploy

### Option 3: DigitalOcean App Platform

1. **Create New App**
   - Go to https://cloud.digitalocean.com/apps
   - Click "Create App"
   - Choose "GitHub" as source
   - Select your repository and branch

2. **Configure Using App Spec**
   - DigitalOcean will detect the `.do/app.yaml` file
   - Or manually configure:
     - **Backend Service**:
       - Source Directory: `backend`
       - Build Command: `npm install`
       - Run Command: `npm start`
       - HTTP Port: 8080
     - **Frontend Service**:
       - Source Directory: `frontend`
       - Build Command: `npm install && npm run build`
       - Output Directory: `dist`

3. **Add Environment Variables**
   - Backend:
     ```
     DATABASE_URL=your_supabase_connection_string
     JWT_SECRET=your_random_secret_key
     RAZORPAY_KEY_ID=rzp_live_xxxxx
     RAZORPAY_KEY_SECRET=your_secret
     PORT=8080
     NODE_ENV=production
     ```
   - Frontend:
     ```
     VITE_API_URL=${backend-api.PUBLIC_URL}
     VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
     VITE_PHONE=+918247588435
     VITE_WHATSAPP=918247588435
     VITE_ADDRESS=Your address
     VITE_MAP_URL=Your map URL
     ```

4. **Deploy**
   - Review and click "Create Resources"
   - Wait for deployment to complete

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Import Project**
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Add Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
   VITE_PHONE=+918247588435
   VITE_WHATSAPP=918247588435
   VITE_ADDRESS=Your business address
   VITE_MAP_URL=Your Google Maps URL
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at https://your-project.vercel.app

5. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

### Option 2: Netlify

1. **Create New Site**
   - Go to https://netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select repository

2. **Configure**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

3. **Add Environment Variables**
   - Same as Vercel above

4. **Deploy**

---

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_random_secret_key_minimum_32_characters

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Server
PORT=5000
NODE_ENV=production
```

### Frontend (.env)
```env
# API
VITE_API_URL=https://your-backend-url.onrender.com

# Razorpay
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx

# Contact Info
VITE_PHONE=+918247588435
VITE_WHATSAPP=918247588435
VITE_ADDRESS=9-262 pallapuveedhy, sankhavaram
VITE_MAP_URL=https://maps.app.goo.gl/E9ccmQFJHA1nArE87
```

---

## Post-Deployment

### 1. Test Payment Flow
- [ ] Add product to cart
- [ ] Proceed to checkout
- [ ] Complete payment with test card
- [ ] Verify order appears in admin panel

### 2. Test All Features
- [ ] User registration/login
- [ ] Product browsing and search
- [ ] Add to cart/wishlist
- [ ] Checkout process
- [ ] Payment integration
- [ ] Order tracking
- [ ] Admin dashboard

### 3. Configure Razorpay Webhook
1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-backend-url.onrender.com/api/webhooks/razorpay`
3. Select events:
   - payment.captured
   - payment.failed
   - payment.authorized
4. Generate webhook secret
5. Add to backend environment variables:
   ```
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

### 4. Enable CORS (if needed)
Ensure your backend allows requests from your frontend domain:
```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.vercel.app'],
  credentials: true
}));
```

### 5. SSL Certificate
- Vercel/Netlify provide automatic SSL
- Render provides automatic SSL
- For custom domains, ensure SSL is configured

### 6. Monitoring & Logging
- Set up error tracking (Sentry, LogRocket)
- Monitor server performance
- Set up uptime monitoring (UptimeRobot)

### 7. Backup Strategy
- Enable Supabase automatic backups
- Export database regularly
- Keep backup of environment variables

---

## Troubleshooting

### Backend Issues

**Database Connection Failed**
- Verify DATABASE_URL is correct
- Check if IP is whitelisted in Supabase
- Ensure SSL is enabled in connection string

**CORS Errors**
- Add frontend URL to CORS whitelist
- Check if credentials are properly configured

**Payment Webhook Not Working**
- Verify webhook URL is accessible
- Check webhook secret matches
- Review Razorpay webhook logs

### Frontend Issues

**API Calls Failing**
- Verify VITE_API_URL is correct
- Check if backend is running
- Inspect network tab for errors

**Payment Modal Not Opening**
- Verify Razorpay key is correct
- Check browser console for errors
- Ensure Razorpay script is loaded

**Build Failures**
- Clear node_modules and reinstall
- Check for TypeScript errors
- Verify all dependencies are installed

---

## Performance Optimization

### Backend
- Enable database connection pooling
- Add Redis for caching (optional)
- Optimize database queries
- Enable gzip compression

### Frontend
- Enable code splitting
- Optimize images (use WebP format)
- Lazy load components
- Enable CDN for static assets

---

## Security Checklist

- [ ] All environment variables are secure
- [ ] Database credentials are not exposed
- [ ] JWT secret is strong and random
- [ ] HTTPS is enabled everywhere
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection
- [ ] XSS protection enabled

---

## Maintenance

### Regular Tasks
- Monitor error logs weekly
- Review database performance monthly
- Update dependencies quarterly
- Backup database weekly
- Review security patches

### Scaling Considerations
- Monitor server resources
- Consider CDN for static assets
- Implement caching strategy
- Database read replicas for high traffic
- Load balancing for multiple instances

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Razorpay Docs**: https://razorpay.com/docs

---

## Quick Deploy Commands

```bash
# Backend deployment check
cd backend
npm install
npm start

# Frontend deployment check
cd frontend
npm install
npm run build
npm run preview

# Test production build locally
# Backend: http://localhost:5000
# Frontend: http://localhost:4173
```

---

**Last Updated**: January 2026
**Version**: 1.0.0
