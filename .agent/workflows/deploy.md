---
description: How to deploy the LittoHR application to Cloudflare Pages
---

To deploy your application, follow these steps:

1. Build the project using the Cloudflare adapter:
   ```bash
   npx @cloudflare/next-on-pages@1
   ```

2. Deploy to Cloudflare Pages:
   // turbo
   ```bash
   npx wrangler pages deploy .vercel/output/static --project-name littohr
   ```

3. Ensure the D1 database is synced found in `schema.sql`:
   ```bash
   npx wrangler d1 execute employee-db --remote --file=./schema.sql
   ```
