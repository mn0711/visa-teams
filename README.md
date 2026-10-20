# visa-teams

Users scan a QR code, enter a visa name, and get an order number (1, 2, 3, ...) and a team = last digit of that number (11 -> 1, 33 -> 3, 20 -> 0).

- `/join` (also `/`): end-user page
- `/admin`: admin page (HTTP Basic auth): QR code, live list, CSV export, reset

## Run

```bash
npm install
ADMIN_PASSWORD=yourSecret BASE_URL=https://your.public.host PORT=3000 npm start
```

- `BASE_URL` is the public address encoded in the QR (if unset, derived from the request Host header).
- `ADMIN_USER` defaults to `admin`; `DATA_FILE` defaults to `./data.json` (back it up / put it on a persistent volume).
- Run a single instance only (order numbers are assigned in-process). Put it behind HTTPS (nginx/Caddy) so phones and the admin password are protected.
