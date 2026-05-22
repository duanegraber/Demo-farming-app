# Demo Farm Manager

Mobile-first demo farming web app cloned from the JTG Farms structure and cleaned up for showing prospects.

## What it demonstrates

- Cattle records: cows, calves, bulls, pastures, notes, and cattle report
- Field records: fields, crop-year activities, harvest/yield notes, crop sales, and crop report
- Equipment records: machines, maintenance, repairs, fuel, yearly cost tracking
- Admin/export screens for simple handoff conversations

## Demo mode

The app ships with fictional sample records and runs locally without Supabase. Demo records are stored in browser localStorage under `demo-farming-app-*` keys.

Admin page options:

- **Reset demo data** restores the fictional sample records.
- **Clear all records and start fresh** empties the local demo records.

## Development

```bash
npm install
npm run dev
```

Quality gates:

```bash
npm run lint
npm run build
```

## Notes

This app intentionally has no private JTG/Farm family data and no copied Supabase fallback key. If a real client wants persistence, connect a separate Supabase project with explicit env vars.
