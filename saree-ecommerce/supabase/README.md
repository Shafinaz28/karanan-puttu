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
4. Paste and run `supabase/profiles.sql`. This creates `public.profiles`, stores the full name entered at customer sign-up, backfills existing users, and restricts staff-only database/storage access to admins. It is safe to run on an existing setup and does not clear product data.
5. If you already created the storage bucket, run `supabase/storage.sql` to ensure only admins can upload or replace product images.
6. Run `supabase/coupons.sql` to enable discount management and checkout code validation. It creates the `coupons` table, adds discount details to orders, and seeds `KARNAN10` at 10% off.
7. Run `supabase/contact_messages.sql` to create the contact form inbox. Public visitors can submit messages; only admins can read them or change their status.

## 4. Create an admin user
1. Supabase → **Authentication → Users → Add user**.
2. Add an email + password (enable “Auto Confirm”).
3. In the SQL Editor, assign this user the trusted admin role (replace the email):

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'admin@example.com';
   ```

   Do not put the role in user-editable metadata. Sign out and back in so the new admin role appears in the user's JWT.
4. Open `/admin/login` and sign in with that account. Customers create accounts at `/login`.
5. Supabase Auth stores password hashes (not readable passwords) and returns an access JWT and refresh token. The Supabase client stores and refreshes the session automatically; do not create a password table or store passwords/tokens yourself.

## 5. Use the admin panel
- URL: `http://localhost:5173/admin`
- Add / edit / delete sarees
- Shop reads live products from Supabase when connected
- If keys are missing, the shop still uses local product data

## Notes
- Image paths can be local (`/sarees/worn/...`) or full image URLs.
- Only users with the trusted `app_metadata.role = admin` claim can manage products, orders, or product images. RLS protects these operations even if a customer tries to call the database directly.
- Manage active/inactive fixed-amount or percentage discounts in the dashboard's Discounts tab. Customers can apply active codes at checkout; the default `KARNAN10` coupon can be edited or disabled.
- Contact form submissions are saved in `public.contact_messages` and appear in the dashboard's Messages tab. Run `contact_messages.sql` before accepting submissions.
- Customer sign-up saves the email in Supabase Auth and the full name in `public.profiles` through the trigger in `profiles.sql`. If email confirmation is enabled, Supabase sends the confirmation link back to the website root. Run `profiles.sql` before accepting sign-ups.
- Supabase's built-in email sender has rate limits. If sign-up reports an email rate limit, wait before retrying or configure custom SMTP under Supabase Authentication settings. Check **Authentication → Users** before retrying in case the unconfirmed account was created; repeated attempts will not bypass the provider limit.
