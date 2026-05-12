# Monthly Habit Tracker

A simple, beautiful habit tracking app with optional cloud sync via Supabase.

---

## 📋 What You Need

- A web browser
- Python (for local development)
- A Supabase account (free - if you want cloud sync)

---

## 🏃 Running Locally

### 1. Start a local server

From this folder, run:

```bash
python3 -m http.server 3000
```

### 2. Open in browser

Go to: **http://localhost:3000**

⚠️ **Important**: Don't just open `index.html` by double-clicking! You need the server running for:
- Supabase authentication to work
- Email verification redirects to work
- Proper CORS handling

---

## ☁️ Setting Up Supabase (Optional - for cloud sync)

If you want users to sync data across devices, you need to configure Supabase properly.

### 1. Go to Supabase Dashboard

https://supabase.com/dashboard

### 2. Add your project keys

Copy your Project URL and anon public key from **Project Settings → API**, then paste them into `supabase-config.js`.

### 3. Configure Authentication URLs

Go to: **Authentication → URL Configuration**

#### Site URL:
- **Local development**: `http://localhost:3000`
- **After deploying**: `https://your-vercel-url.vercel.app`

#### Redirect URLs:
Add both (one per line):
```
http://localhost:3000/**
https://your-vercel-url.vercel.app/**
```

### 4. Create the database table

Go to: **SQL Editor** and run the contents of `supabase-setup.sql`.

This ensures:
- ✅ Each user can only see/edit their own data
- ✅ No one can access another user's habits
- ✅ Data is properly isolated

---

## 🔍 How It Works

### Data Storage

**localStorage (Browser)**
- Stores signed-out data locally in your browser
- Stores signed-in cache under a per-user browser key
- Works completely offline
- No account needed
- Private to your device

**Supabase (Cloud - Optional)**
- Only syncs when you sign in (click ☁️ button)
- Syncs every 30 seconds when signed in
- Enables multi-device access
- Uses smart conflict resolution (newer timestamp wins)

### Flow

1. **Without signing in**:
   - Everything saved to localStorage only
   - Works perfectly, just no cross-device sync

2. **After signing in**:
   - Existing signed-out data uploads only when your cloud account is empty
   - Existing cloud data wins over anonymous local data when your account already has data
   - Data syncs to Supabase after edits
   - When you open on another device → pulls latest from cloud
   - Each Supabase user can only read/write their own row because of RLS

---

## 🐛 Troubleshooting

### "Email verification redirects to localhost:3000 but nothing loads"

**Fix**: Make sure you're running the local server:
```bash
python3 -m http.server 3000
```

### "Supabase auth isn't working"

**Check**:
1. Is your local server running?
2. Are you accessing via `http://localhost:3000` (not `file://...`)?
3. Did you set the Site URL in Supabase dashboard?

### "I can see other users' data"

**Fix**: You need to set up Row Level Security (RLS) policies - see Supabase setup above.

### "Data not syncing"

**Check**:
1. Are you signed in? (☁️ button should be blue)
2. Open browser console (F12) - any errors?
3. Check Supabase table has data: Dashboard → Table Editor → habit_data

---

## 🚀 Ready to Deploy?

See [DEPLOYMENT.md](DEPLOYMENT.md) for how to get this online in 2 minutes!

### Cloudflare deploy note

This app is deployed from the parent folder using Cloudflare Wrangler, with `assets.directory` set to `journal_app`. The working command is:

```bash
npx --yes wrangler@latest deploy
```

---

## 📁 File Structure

```
planner/
├── index.html          # Main HTML structure
├── style.css          # All the styling
├── script.js          # App logic + Supabase integration
├── supabase-config.js # Public Supabase project URL + anon key
├── supabase-setup.sql # Per-user data table + RLS policies
├── README.md          # You are here
└── DEPLOYMENT.md      # How to deploy online
```

---

## ⚙️ Configuration

### Changing Supabase Project

Edit `supabase-config.js`:

```javascript
window.LIFELINE_SUPABASE = {
  url: 'https://your-project.supabase.co',
  anonKey: 'your-anon-key-here'
};
```

Get these from: **Supabase Dashboard → Settings → API**

---

## 🤝 Sharing with Friends

### Option 1: Everyone uses your Supabase (easiest)
- Deploy to Vercel (see DEPLOYMENT.md)
- Share the URL
- Each friend creates their own account
- ⚠️ You pay for everyone's storage (but Supabase free tier is generous)

### Option 2: Each person deploys their own (most private)
- Each friend clones this repo
- Each creates their own Supabase project
- Each deploys to Vercel with their own Supabase keys
- Everyone has complete privacy + control

---

## 💡 Tips

- **Backup your data**: If using only localStorage, export your data regularly (it's stored in browser storage)
- **Use cloud sync**: Sign in before switching devices
- **Email verification**: Required for cloud sync to work
- **Privacy**: With RLS policies enabled, your data is completely private

---

## ❓ Questions?

- Local development not working? Check you're using `http://localhost:3000`
- Deployment questions? See DEPLOYMENT.md
- Supabase issues? Check the SQL policies are set up correctly
