# Horoscope API

Express + MongoDB + JWT API that:

- Signs up and logs in users
- Auto-detects zodiac sign from birthdate
- Returns a daily horoscope and a 7‑day history
- I have used Copilot while coding (AI Tool).

### Prerequisites

- Node.js 18+ and npm
- MongoDB running locally or a cloud MongoDB URI

### Configuration

- MongoDB URI: `mongodb://127.0.0.1:27017/horoscope_api`

### Install and run

```powershell
npm install
npm start
```

Server default: http://localhost:4000

### Test Using Postman

I have provided a Postman collection and environment under `postman/` for testing:

- `postman/horoscope-api.postman_collection.json`
- `postman/local.postman_environment.json`

Steps:

1. Open Postman and Import both files (Collection and Environment).
2. Select the `horoscope-api-local` environment (it sets `baseUrl` to `http://localhost:4000`).
3. Start the server (see Install and run).
4. In the collection, run requests in this order:

- Auth > Signup (creates a test user)
- Auth > Login (auto-saves token to the environment)
- Horoscope > Today
- Horoscope > History


## Design decisions

- Express server with minimal dependencies; no external horoscope APIs.
- `utils/horoscopes.js` uses a base message per zodiac and a date-derived "lucky number" for daily variety without persistence.
- Auth with JWT: Short, stateless session tokens; user password hashed (bcrypt).
- Zodiac sign is computed from birthdate on signup and stored with the user for quick lookups.
- `History` collection stores one document per user per day (unique index on `user + servedForDate`) for idempotent writes and fast history queries.
- Backfill on read: The history endpoint fills any missing days for the requested window by computing and upserting records per day (idempotent), so clients always receive a contiguous range.
- UTC-normalized dates: All daily boundaries use UTC (`startOfUTCDay`) to avoid timezone drift.

## Improvements with more time

- Validation and error handling: Schema validation with Zod, unified error format, field-level messages.
- Auth hardening: Token rotation/refresh tokens, password reset flows, email verification.
- Observability: Request IDs, structured logs, metrics (p95 latencies).
- Caching: Cache computed horoscopes by `(sign, date)` to minimize recompute in `GET /history` backfills.
- Testing: Unit tests (utils, auth).
- Deployment: Dockerfile, docker-compose, environment-specific config.

## Scaling to personalized (per-user) horoscopes

- Don’t create the horoscope when the user opens the app. Create everyone’s next-day horoscope at night and save it.
- Put today’s text in a fast store (like a “short-term memory”). When the user asks, read from there first.
- If nothing is ready, show a simple backup message now and generate the real one in the background for next time.
- Use multiple worker processes/machines to create horoscopes in parallel so it’s fast even for many users.
- If generation fails, retry a few times and fall back to the simple message so users aren’t blocked.