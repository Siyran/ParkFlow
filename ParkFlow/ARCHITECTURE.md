# ParkFlow Architecture

## Scope

ParkFlow is a parking rental marketplace with a React frontend and a Node.js/Express backend.

## Agent Boundaries

- `client/` owns UI, routing, local state, accessibility, and responsive layout.
- `server/` owns API routing, auth, booking rules, payments, database access, and caching.
- Shared behavior is defined only through documented request and response contracts.

## Shared API Response Format

```json
{
  "success": true,
  "data": {},
  "message": "Human-readable message",
  "error": null
}
```

## Core Business Rules

- Price: Rs. 60/hour, Rs. 400/full day (10 hours)
- Owner revenue share: Rs. 40/hour
- Platform cut: Rs. 20/hour
- Owner withdrawals are processed at calendar month end
- Supported durations: 1h, 2h, 3h, full day
- Double-booking is not allowed
