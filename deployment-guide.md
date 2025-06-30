# UBI Compass Deployment Guide

## 🚀 Deploying to ubicompass.info

This guide covers deploying UBI Compass to your production domain.

### 📋 Pre-Deployment Checklist

✅ **Routes Cleaned Up**
- Main route (`/`) uses redesigned GUI
- All test/development routes removed
- Only essential API routes remain

✅ **Components Cleaned Up**
- Removed 50+ unused components
- Only production components remain:
  - `ubi-compass-redesigned.tsx` (main)
  - `age-distribution-control/`
  - `government-spending-control/`
  - `results-dashboard/`
  - `ubi-amounts-control/`
  - `ubi-optimizer/`
  - `language-selector/`
  - `year-selector/`
  - `triple-handle-slider/`
  - Translation system

✅ **Production Ready Features**
- Multi-language support with hash tables
- Google AI feedback analysis
- Buy Me A Coffee integration
- Professional SEO metadata
- Debug sections hidden

### 🌐 Domain Configuration

**Domain**: `ubicompass.info`

**DNS Settings** (configure with your domain provider):
```
Type: A
Name: @
Value: [Your server IP]

Type: CNAME  
Name: www
Value: ubicompass.info
```

### 🔧 Environment Variables

Create `.env.production` file:

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/UBIDatabase
DB_USER=postgres
DB_PASSWORD=YOUR_SECURE_PASSWORD

# Google AI APIs (Translation + Natural Language)
GOOGLE_TRANSLATE_API_KEY=YOUR_GOOGLE_API_KEY

# Production Settings
NODE_ENV=production
QWIK_PUBLIC_DOMAIN=https://ubicompass.info
```

### 📦 Build Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build locally
npm run preview

# Start production server
npm run serve
```

### 🚀 Deployment Options

#### Option 1: Static Hosting (Recommended)
```bash
# Build static files
npm run build

# Upload dist/ folder to:
# - Netlify
# - Vercel  
# - GitHub Pages
# - Any static host
```

#### Option 2: Node.js Server
```bash
# Build and start server
npm run build
npm run serve

# Or use PM2 for production
pm2 start "npm run serve" --name "ubi-compass"
```

#### Option 3: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "serve"]
```

### 🔒 Security Checklist

- [ ] Update all API keys for production
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure CORS for ubicompass.info
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Enable security headers

### 📊 Analytics & Monitoring

Consider adding:
- Google Analytics
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring

### 🎯 Post-Deployment

1. **Test all functionality**:
   - Language switching
   - UBI calculations
   - Feedback submission
   - Buy Me A Coffee links

2. **Update Buy Me A Coffee URLs**:
   - Replace placeholder URLs with your actual accounts
   - Test donation flow

3. **SEO Optimization**:
   - Submit sitemap to Google
   - Set up Google Search Console
   - Monitor search rankings

### 🔄 Updates & Maintenance

```bash
# Pull latest changes
git pull origin main

# Rebuild and deploy
npm run build
# Upload new dist/ folder or restart server
```

### 📞 Support

- **Domain**: ubicompass.info
- **Repository**: Your GitHub repository
- **Issues**: GitHub Issues page

---

**UBI Compass is now ready for production deployment! 🎉**
