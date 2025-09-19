<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1_V_Ujn5sUZfVHYPtjmKjMtokRRidYYyu

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Set Sanity env vars in [.env.local](.env.local):
   - `VITE_SANITY_PROJECT_ID=<your-sanity-project-id>`
   - `VITE_SANITY_DATASET=production`
   - `SANITY_WRITE_TOKEN=<sanity-token-with-mutate-scope>` (required for view counts)
3. Run the app:
   `npm run dev`


---

### Deploy (Vercel)

- Add the same env vars in Vercel Project Settings → Environment Variables:
  - `VITE_SANITY_PROJECT_ID`
 - `VITE_SANITY_DATASET` (use `production` unless you have another dataset)
 - `SANITY_WRITE_TOKEN` (token with `Editor` or `Writer` role for `post` documents)
- Redeploy the project after adding variables.

Note: The app uses Sanity with CDN disabled (`useCdn: false`) for immediate consistency after publishing in Studio.

- Additional notes:
- Service Worker is enabled only on production deployments. It is not registered on `localhost` or Vercel preview deployments (hostnames containing `-git-`).
  - Sanityの即時反映のため、Sanity API/画像はSWで network-first を強制し、画像の長期キャッシュを避けています。
 - Sanity Studio/CLI configs have no fallback projectId. Ensure `VITE_SANITY_PROJECT_ID` is set in your environment. Locally, pass env vars when running Studio if your shell doesn’t auto‑load `.env.local`:
   - macOS/Linux: `VITE_SANITY_PROJECT_ID=YOUR_ID VITE_SANITY_DATASET=production npm run studio`
   - PowerShell: `$env:VITE_SANITY_PROJECT_ID='YOUR_ID'; $env:VITE_SANITY_DATASET='production'; npm run studio`
