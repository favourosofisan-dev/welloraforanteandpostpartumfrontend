# Wellora Mama Deployment

This repo is configured for:

- Frontend: Netlify
- Backend API: Vercel, using the `backend` directory as the Vercel project root
- Database: Neon Postgres through Prisma
- Media: image/video bytes stored in Neon in the `MediaAsset` table

## Neon

Create a Neon project and copy both connection strings:

- `DATABASE_URL`: pooled Neon connection string for normal Prisma queries
- `DIRECT_URL`: direct Neon connection string for Prisma migrations

Use SSL in both strings, for example `?sslmode=require`.

Then from `backend` run:

```bash
npm install
npm run prisma:generate
npx prisma migrate dev --name init_neon_media
```

For production, Vercel runs:

```bash
npm run vercel-build
```

That command generates Prisma Client, applies pending migrations with `prisma migrate deploy`, and builds the backend.

## Vercel Backend

Create a Vercel project with:

- Root Directory: `backend`
- Build Command: `npm run vercel-build`
- Output Directory: leave empty

Set these Vercel environment variables:

```text
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=your-long-random-secret
GEMINI_API_KEY=your-gemini-key
FRONTEND_URL=https://your-netlify-site.netlify.app
NODE_ENV=production
JSON_BODY_LIMIT=25mb
MAX_MEDIA_UPLOAD_BYTES=15728640
```

## Netlify Frontend

Create a Netlify project from the repo root:

- Build command: `npm run build`
- Publish directory: `dist`

The Netlify config proxies `/api/*` to the deployed Vercel backend, so the app can work even if no frontend API variable is set. If you change the Vercel backend URL, update `netlify.toml`.

You can also set this Netlify environment variable to call the backend directly from the browser:

```text
VITE_API_BASE_URL=https://your-vercel-backend.vercel.app
```

If you use `VITE_API_BASE_URL`, Vercel must allow the Netlify origin. Set `FRONTEND_URL` in the Vercel backend project to the exact Netlify site URL, for example:

```text
FRONTEND_URL=https://your-netlify-site.netlify.app
```

## Media API

The backend stores images and videos directly in Neon as binary data.

- `GET /api/media` lists media metadata
- `GET /api/media/:id` streams the image or video
- `POST /api/media` uploads media and requires a bearer token
- `DELETE /api/media/:id` deletes media and requires a bearer token

Upload body:

```json
{
  "fileName": "exercise-demo.mp4",
  "mimeType": "video/mp4",
  "description": "Breathing exercise demo",
  "base64": "AAAA..."
}
```

Neon can store binary media, but large videos are usually better in object storage. Keep `MAX_MEDIA_UPLOAD_BYTES` conservative unless you intentionally want bigger database rows.
