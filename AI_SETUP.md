# AI Integration Setup Guide

## Overview
Your app now uses two AI providers for optimal performance and cost efficiency:

- **Groq (Llama 3.3)** → Chat feature (career coaching)
- **Google Gemini 1.5 Flash** → Resume optimization & keyword generation

## Why This Setup?

### Groq for Chat
- ⚡ Fastest inference (100+ tokens/sec)
- 🆓 Free tier: 30 RPM, 14,400 requests/day
- 💬 Perfect for conversational AI

### Google Gemini for Optimization
- 🎯 Better at structured JSON outputs
- 🆓 Free tier: 15 RPM, 1,500 requests/day
- 📊 Excellent for analysis tasks

## Setup Instructions

### 1. Get Groq API Key (Free)
1. Visit: https://console.groq.com/keys
2. Sign up for free (no credit card required)
3. Create a new API key
4. Copy the key

### 2. Get Google Gemini API Key (Free)
1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

### 3. Add Keys to Environment Variables
Create a `.env.local` file in your project root:

```bash
# Groq - For Chat
GROQ_API_KEY=gsk_your_groq_key_here

# Google Gemini - For Resume Optimization
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
```

### 4. Restart Development Server
```bash
npm run dev
```

## Usage Estimates for 100 Users

Assuming each user makes:
- **10 chat messages/day** = 1,000 chat requests/day
- **3 optimizations/day** = 300 optimization requests/day

### Groq (Chat)
- Daily usage: 1,000 requests
- Free tier limit: 14,400 requests/day
- ✅ **93% capacity remaining**

### Gemini (Optimization)
- Daily usage: 300 requests
- Free tier limit: 1,500 requests/day
- ✅ **80% capacity remaining**

## Cost Analysis

**Total cost for 100 users: $0/month** 🎉

Both services remain completely free within these usage patterns.

## Scaling Beyond 100 Users

If you exceed free tier limits:

### Groq Pricing
- Pay-as-you-go: $0.05-0.27 per million tokens
- Still very affordable

### Gemini Pricing
- Pay-as-you-go: $0.075 per million tokens (input)
- Very competitive pricing

## Features

### Chat Endpoint (`/api/ai/chat`)
- Streaming responses
- Authentication required
- Groq Llama 3.3 70B model
- Career coaching system prompt

### Optimization Endpoint (`/api/ai/optimize`)
- Resume analysis
- ATS score calculation
- Keyword matching
- Improvement suggestions
- Google Gemini 1.5 Flash model

## Troubleshooting

### "AI service not configured" Error
- Check that API keys are in `.env.local`
- Restart development server after adding keys
- Verify keys are valid

### Rate Limiting
If you hit rate limits:
1. Implement request queueing
2. Add caching for similar requests
3. Consider upgrading to paid tier

## Next Steps

1. ✅ Install dependencies (`npm install`)
2. ✅ Set up environment variables
3. ✅ Test chat feature at `/coach`
4. ✅ Test optimization at `/optimizer`
5. Monitor usage in provider dashboards

## API Key Security

⚠️ **Never commit API keys to git**
- Keys should only be in `.env.local`
- `.env.local` is in `.gitignore`
- Use environment variables in production

## Production Deployment

For Vercel/Netlify/etc:
1. Add environment variables in dashboard
2. Use the same variable names:
   - `GROQ_API_KEY`
   - `GOOGLE_GENERATIVE_AI_API_KEY`
3. Redeploy application

---

**Ready to test!** 🚀
