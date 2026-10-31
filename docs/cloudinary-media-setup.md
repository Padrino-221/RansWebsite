# Cloudinary image uploads for the CMS

The admin upload API signs each image upload on the Next.js server, then sends it to Cloudinary. The Cloudinary API secret stays on the server and is never sent to the browser.

## Neon CMS content storage

The CMS stores the website's editable content in a Neon Postgres `site_content` table as JSONB. The table is created automatically on the first content request, and an empty database is seeded from the existing local CMS content when available (otherwise from the default content file).

For local development, configure the direct and pooled Neon connection URLs in `.env.local`:

```dotenv
DATABASE_URL=your-neon-direct-connection-string
DATABASE_URL_POOLED=your-neon-pooled-connection-string
```

The app uses `DATABASE_URL_POOLED` when present and falls back to `DATABASE_URL`. For Vercel, add these values to server-side environment settings for Development, Preview, and Production as appropriate. Keep the production database separate from preview content. The admin password remains in `CMS_ADMIN_PASSWORD`; it is not stored in the content table.

## Configure the app

In the Cloudinary Console, find the account's **Cloud name**, **API key**, and **API secret**. Add them to the project-root `.env.local` file for local development:

```dotenv
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Restart `npm run dev` after changing the file. For production, add the same three values to your hosting provider's encrypted server environment settings and redeploy. Do not add the API secret to a `NEXT_PUBLIC_` variable or commit it to source control.

## Upload through the CMS

Open `/admin`, sign in, choose an image field, click **Upload image**, and select a JPEG, PNG, WebP, GIF, or AVIF image up to 10 MB. Then save the content to publish the returned Cloudinary URL. Uploads use the server-side signed Cloudinary API, so the browser does not need direct-upload credentials.
