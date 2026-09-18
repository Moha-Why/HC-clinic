# HealthCare Clinic

Next.js App Router site for HealthCare Clinic. Marketing pages are static. Booking and staff admin go through this app’s **server** to **[Clinic-Backend](https://github.com/Moha-Why/Clinic-Backend)**. The browser never sees Express, Supabase keys, or JWT secrets.

```
Browser → hc_clinic (:3000) → Clinic-Backend (:4000) → Supabase
```

## What this app does

| Path | Role |
|---|---|
| `/`, `/about`, `/services`, `/contact` | Static marketing (homepage doctor copy is not loaded from the API) |
| `/booking` | Guest booking: active doctors, clinic-timezone slots, submit name + phone |
| `/admin/login` | Staff email + password |
| `/admin` | Appointments: Upcoming / Past, cancel, complete, no-show |
| `/admin/doctors` | Doctors and weekly hours (replaces the old clinic-wide available-days table) |

Admin auth is a Next-owned httpOnly cookie `accessToken` (`sameSite=lax`, `secure` in production). `proxy.ts` checks Clinic-Backend `GET /api/auth/me` before `/admin` (except login).

## Staff dashboard (portfolio demo)

Open **`/admin/login`** (locally: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)).

| | |
|---|---|
| Email | `admin@clinic.com` |
| Password | `ClinicAdmin-2026` |

That account is created by `npm run seed` in [Clinic-Backend](https://github.com/Moha-Why/Clinic-Backend) (defaults above unless `SEED_ADMIN_*` was changed). After login you land on `/admin` (appointments). Doctors and weekly hours are at `/admin/doctors`.

This is a portfolio project, so these credentials are intentional for reviewers. Do not reuse them on a real clinic.

## Local development

Run **both** processes.

```bash
# Terminal 1 — API
cd ../Clinic-Backend
npm install
# apply clinic_schema.sql once in Supabase if the DB is empty
npm run seed    # once
npm run dev     # http://localhost:4000
```

```bash
# Terminal 2 — this app
cd ../hc_clinic
npm install
```

`.env.local`:

```env
CLINIC_API_URL=http://localhost:4000
```

That is the only env var. There are no `NEXT_PUBLIC_SUPABASE_*` or `ADMIN_PASSWORD` values.

```bash
npm run dev     # http://localhost:3000
```

Then sign in at `/admin/login` with the demo account above. The password is stored hashed in `users`; it is not an env var in this app.

## Booking and appointments

- Slot times come from the API (`CLINIC_TZ` on the backend). A successful submit **is** a booked appointment.
- Cancel only while the visit is still upcoming (`booked` and start in the future).
- After `appointment_end_at`, a `booked` row becomes `expired` on the next admin or slots fetch. Staff then mark **completed** or **no-show**.

## Deploy

Deploy Clinic-Backend first and confirm `GET /health` on its public URL.

On the Next host (e.g. Vercel), set **server-only**:

```env
CLINIC_API_URL=https://your-api.example.com
```

No trailing slash. No Supabase keys here. Redeploy this app after the API URL is known.

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
```
