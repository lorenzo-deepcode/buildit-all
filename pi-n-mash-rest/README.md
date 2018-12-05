# pi-n-mash-rest

## To run

```
npm i
npm start
```

## API

- POST /api/auth/motion Activate session (due to motion sensor detection)
- POST /api/auth/fingerprint/:user Fingerprint auth passed for user
- POST /api/auth/voice/:user Voice auth passed for user
- POST /api/auth/face/:user Face auth passed for user
- GET /api/auth/user Get the auth status for this user
- DELETE /api/auth/ Cancel the session for the current user
