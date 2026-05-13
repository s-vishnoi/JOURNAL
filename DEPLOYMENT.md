# Journal Cloud Deployment

This version stays a simple HTML/CSS/JS app. Hosting serves the files, and Supabase handles login plus per-user data.

## 1. Create Supabase Project

1. Open https://supabase.com/dashboard.
2. Create a project.
3. Open SQL Editor.
4. Paste and run `supabase-setup.sql`.

That creates `habit_data` with Row Level Security, so each signed-in user can only access their own journal data.

## 2. Add Supabase Keys

In Supabase, open Project Settings > API.

Copy:

- Project URL
- anon public key

Paste them into `supabase-config.js`:

```js
window.LIFELINE_SUPABASE = {
  url: 'https://your-project-id.supabase.co',
  anonKey: 'your-anon-public-key'
};
```

The anon key is designed to be public in browser apps. The RLS policies in `supabase-setup.sql` are what protect user data.

## 3. Configure Auth URLs

In Supabase, open Authentication > URL Configuration.


```

## 4. Deploy via Cloudflare Workers (Recommended)

This app is deployed successfully as the `journal_app` folder only. The working publish flow uses the root `wrangler.jsonc` with `assets.directory` set to `journal_app`.

From the `JOURNAL` project root, run:

```bash
npx --yes wrangler@latest deploy
```

Confirm `wrangler.jsonc` contains:

```json
{
  "name": "journalify",
  "compatibility_date": "2026-05-12",
  "assets": {
    "directory": "journal_app"
  }
}
```

This publishes only the `journal_app` files as static assets. The current live site is:

`https://journalify.samvardhanvishnoi.workers.dev`

> Important: do not deploy the parent folder or the root workspace directly. The `journal_app` directory is the correct deploy target.





### Cloudflare Pages

Connect the repo in the hosting dashboard. After the first setup, every GitHub commit redeploys automatically.

Settings for this folder:

- Build command: leave blank
- Publish/output directory: `JOURNAL/journal_app`

## How It Works

Signed out:

- Data stays in localStorage on the current browser.

Signed in:

- Each signed-in Supabase user gets a separate local browser cache.
- Existing signed-out local data uploads only if that user's cloud row is empty.
- Existing cloud data loads automatically when available.
- Since sign-in required, cloud storage is always available! 
