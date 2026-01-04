# 🚀 Cloudflare Deployment Guide

Since everything is working locally, it's time to go live! Follow these 5 steps to host your app on Cloudflare Pages.

---

### 1. Connect to GitHub
Cloudflare Pages works best with a GitHub repository.
1.  Push your code to a new (or existing) repository on GitHub.
2.  Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
3.  Click **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
4.  Select your repository.

### 2. Configure Build Settings
During the setup, use these exact settings:
- **Project Name**: `littohr`
- **Framework Preset**: `Next.js`
- **Build Command**: `npx @cloudflare/next-on-pages@1`
- **Build Output Directory**: `.vercel/output/static`
- **Deployment Command**: **(Leave this EMPTY)** ⚠️
- **Environment Variable**: 
  - Set `NODE_VERSION` to `18` or higher.

> [!CAUTION]
> If you see a "Deployment command" field, do not put `npx wrangler deploy` there. Cloudflare Pages handles the deployment automatically from the output directory.

### 3. Create the Database (D1)
If you haven't created your database in Cloudflare yet:
1.  In the dashboard, go to **Workers & Pages** > **D1**.
2.  Click **Create Database** > **Create**.
3.  **Name**: `employee-db`
4.  Once created, copy your **Database ID**.

### 4. Bind the Database to your Page
This is the most "missed" step!
1.  Go to your project in **Workers & Pages**.
2.  Click the **Settings** tab > **Functions**.
3.  Scroll down to **D1 database bindings**.
4.  Click **Add binding**.
5.  **Variable name**: `DB` (Must be exactly `DB`)
6.  **D1 database**: Select `employee-db` from the dropdown.

### 5. Finalize the Database Schema
You need to run your `schema.sql` on the live database. Run this command in your terminal:
```bash
npx wrangler d1 execute employee-db --remote --file=./schema.sql
```

---

### 🛡️ Firebase Note
Make sure to add your production URL (once Cloudflare gives it to you) to your **Authorized Domains** in the [Firebase Console](https://console.firebase.google.com/) under **Authentication** > **Settings**. If you don't do this, login won't work on the live site!
