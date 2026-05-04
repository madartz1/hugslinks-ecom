# HUGSlinks Ecom Platform

A Netlify + Stripe + Supabase ecommerce platform for HUGS.

## Required Netlify environment variables

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

Optional for admin login:

- `SUPABASE_ANON_KEY`

## Deploy

1. Upload this folder to GitHub.
2. Connect repo to Netlify.
3. Add environment variables.
4. Run `database/schema.sql` in Supabase SQL editor.
5. Create a public Supabase Storage bucket named `product-images`.
6. Deploy.

## Main pages

- `/` home
- `/shop.html` shop
- `/success.html` order success
- `/admin.html` admin dashboard
