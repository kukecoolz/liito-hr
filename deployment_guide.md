# 🚀 Cloudflare Deployment Guide

Since everything is working locally, it's time to go live! Follow these 5 steps to host your app on Cloudflare Pages.

---

### 1. Connect to GitHub
Cloudflare Pages works best with a GitHub repository.
1.  Push your code to a new (or existing) repository on GitHub.
2.  Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
3.  Click **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
4.  Select your repository.

### 2. Configure Build Settings (IMPORTANT) ⚠️
We have switched to **OpenNext** for a more reliable deployment.

**Go to your Cloudflare Dashboard and set these EXACTLY:**

| Field | Set to... |
| :--- | :--- |
| **Build command** | `npm run build` |
| **Build output directory** | `.open-next` |
| **Deployment command** | **DELETE EVERYTHING - LEAVE EMPTY** ❌ |

> [!CAUTION]
> **CRITICAL FIX:**
> 1. Click **Settings** (top tab) > **Build & deployments**.
> 2. Click **Configure methods** (or Edit).
> 3. Look for the box labeled **"Deployment command"**.
> 4. It likely has `npx wrangler deploy` or some other text in it. **DELETE IT COMPLETELY.**
> 5. Make sure the box is **100% EMPTY** (no text, no spaces).
> 6. Save and click **Retry deployment**.

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
