# Google Translate API Setup Guide

## Overview
This guide explains how to set up Google Translate API for UBI Compass multilingual support.

## Prerequisites
- Google Cloud account
- Billing enabled
- UBI Compass project

## Setup Steps

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: `ubi-compass-translate`
3. Enable billing for the project

### 2. Enable Cloud Translation API
1. Go to APIs & Services → Library
2. Search for "Cloud Translation API"
3. Click "Enable"

### 3. Create API Key
1. Go to APIs & Services → Credentials
2. Click "+ CREATE CREDENTIALS" → "API key"
3. Copy the API key

### 4. Configure API Key Restrictions
1. Click on your API key
2. Under "API restrictions":
   - Select "Restrict key"
   - Check "Cloud Translation API"
3. Click "Save"

### 5. Add to Environment
Add to your `.env` file:
```
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

## Testing
1. Restart your dev server
2. Select a non-English language
3. Verify translations appear

## Supported Languages
The API supports 70+ languages including:
- French (fr)
- Spanish (es)
- German (de)
- Chinese (zh)
- Japanese (ja)
- Arabic (ar)
- And many more!

## Cost Estimation
- $20 per 1M characters translated
- Typical UBI Compass session: ~5,000 characters
- Cost per session: ~$0.10
- Very affordable for global accessibility

## Troubleshooting
- 403 Forbidden: Enable billing
- 400 Bad Request: Check API key restrictions
- 401 Unauthorized: Invalid API key
