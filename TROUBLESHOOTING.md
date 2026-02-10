# Troubleshooting: "Failed to Optimize" Error

## Problem
You're seeing "Failed to optimize resume" error when trying to use the AI Optimizer.

## Root Cause
The environment variables are not loaded properly. This happens when:
1. `.env.local` file doesn't exist
2. Dev server wasn't restarted after adding API keys
3. API key is invalid or has wrong format

## Solution

### Step 1: Verify `.env.local` exists
✅ I've already created it from `.env.example`

### Step 2: Check API Keys in `.env.local`

Open `.env.local` and ensure it has:

```bash
# These need to be YOUR actual API keys, not placeholders!

GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Get Your API Keys

#### Google Gemini API Key (Required for Optimizer)
1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIzaSy...`)
4. Paste it in `.env.local` for `GOOGLE_GENERATIVE_AI_API_KEY`

#### Groq API Key (Required for Chat)
1. Go to: https://console.groq.com/keys
2. Sign up (free, no credit card)
3. Create new API key
4. Copy the key (starts with `gsk_...`)
5. Paste it in `.env.local` for `GROQ_API_KEY`

### Step 4: Restart Dev Server

**IMPORTANT:** You MUST restart the dev server after adding/changing `.env.local`

```bash
# Stop current server (Ctrl+C in terminal)
# Then start again:
npm run dev
```

### Step 5: Test the Optimizer

1. Go to http://localhost:3000/optimizer
2. Paste a job description
3. Paste your resume text or upload PDF
4. Click "Analyze Resume"

## Still Getting Errors?

### Check Console Logs
Open browser DevTools (F12) → Console tab to see detailed error messages.

### Check Terminal Output
Look at your terminal running `npm run dev` for error details.

### Common Error Messages:

#### "AI service not configured"
- API key is missing from `.env.local`
- Dev server not restarted after adding keys

#### "Failed to generate AI response"
- API key is invalid
- Check if you copied the full key
- Verify key hasn't been revoked

#### "AI response was not in valid JSON format"
- This is a model output issue
- Usually resolves on retry
- If persistent, the model might be having issues

### Test API Keys Manually

#### Test Gemini:
```bash
curl https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY
```

If valid, you'll see a list of models.

#### Test Groq:
```bash
curl -X POST "https://api.groq.com/openai/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_GROQ_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hi"}],"model":"llama-3.3-70b-versatile"}'
```

## Quick Fix Checklist

- [ ] `.env.local` file exists in project root
- [ ] `GOOGLE_GENERATIVE_AI_API_KEY` is set with real key
- [ ] `GROQ_API_KEY` is set with real key
- [ ] Dev server restarted after adding keys
- [ ] Tried in incognito/private browser window
- [ ] Checked browser console for errors
- [ ] Checked terminal for error logs

## Need More Help?

Check the detailed error message returned by the API. I've added better error logging that will show:
- The specific error message
- Whether it's an API key issue
- Whether it's a model response issue
- Raw AI output for debugging

The error will appear in both:
- Browser console (F12)
- Terminal where dev server is running
