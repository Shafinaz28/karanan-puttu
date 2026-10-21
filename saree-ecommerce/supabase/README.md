# Supabase setup (Admin + products database)

## 1. Create a project
1. Go to [https://supabase.com](https://supabase.com) and create a project.
2. Open **Project Settings → API**.
3. Copy **Project URL** and **anon public** key.

## 2. Connect the app
In `saree-ecommerce/`:

```bash
copy .env.example .env
```

Edit `.env`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Restart `npm run dev`.

## 3. Create the tables
1. In Supabase open **SQL Editor**.
2. Paste and run everything in `supabase/schema.sql`. That creates the products table and your sarees.
3. Paste and run everything in `supabase/orders.sql`. That creates the orders table.

## 4. Create an admin user
1. Supabase → **Authentication → Users → Add user**.
2. Add an email + password (enable “Auto Confirm”).
3. Open the store at `/admin/login` and sign in with that user.

## 5. Use the admin panel
- URL: `http://localhost:5173/admin`
- Add / edit / delete sarees
- Shop reads live products from Supabase when connected
- If keys are missing, the shop still uses local product data

## Notes
- Image paths can be local (`/sarees/worn/...`) or full image URLs.
- Authenticated users can manage all products (RLS). For production, restrict to specific admin emails via a stricter policy.
