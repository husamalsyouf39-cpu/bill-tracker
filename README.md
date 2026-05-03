# Bill Tracker

A mobile-first personal bill tracker built with React + Firebase Realtime Database.

## Local development

```bash
npm install
npm start
```

The app runs at http://localhost:3000.

## Environment variables

Copy `.env.example` to `.env.local` and fill in your Firebase credentials:

```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_DATABASE_URL=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

## Deploy to Vercel

### 1. Push to GitHub

```bash
# In the bill-tracker directory:
git init
git add .
git commit -m "Initial commit"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/bill-tracker.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to vercel.com and sign in (use your GitHub account)
2. Click **Add New → Project**
3. Import your `bill-tracker` repository
4. Under **Environment Variables**, add all 7 `REACT_APP_*` variables from your `.env.local`
5. Click **Deploy**

Vercel auto-detects Create React App and sets the build command to `npm run build` and output directory to `build/`.

### 3. Add to iPhone home screen

1. Open the deployed Vercel URL in **Safari** on your iPhone
2. Tap the **Share** button (box with arrow at the bottom)
3. Scroll down and tap **Add to Home Screen**
4. Name it "Bills" and tap **Add**

The app will launch full-screen without the Safari address bar, just like a native app.
