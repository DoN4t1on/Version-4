# LocalDonation Web

LocalDonation is a React and Express application for local donation suggestions. Users can register or sign in, create local suggestions, pledge donation amounts, comment, upvote or downvote posts and comments, view supporter/voter lists, report content, and manage profile information.

The repository contains two Node.js projects:

- `src/`: React 18 frontend built with Parcel.
- `server/`: Express 5 API backed by MongoDB and Mongoose.

## Requirements

- Node.js `24.x`
- npm `11.x`
- MongoDB running locally or a reachable MongoDB connection string
- Optional: Mailjet credentials for production email delivery
- Optional: Google Maps, Google OAuth, and Facebook OAuth credentials

Use the project Node version when possible:

```bash
nvm use
```

## Repository Layout

```text
.
├── src/                    # React frontend
│   ├── components/          # Shared frontend components
│   ├── hooks/               # Account and upload hooks
│   ├── img/                 # Frontend static assets
│   ├── reactStore/          # Redux store and reducers
│   └── services/            # API, auth, and error helpers
├── server/                 # Express API
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth, upload, validation, admin checks
│   ├── models/              # Mongoose models
│   ├── routes/              # API route registration
│   ├── services/            # Email, social auth, request validation
│   ├── test/                # Node test runner tests
│   └── images/.gitkeep      # Runtime upload directory placeholder
├── .env.example             # Frontend env example
├── server/.env.example      # API env example
├── package.json             # Frontend scripts and dependencies
└── server/package.json      # API scripts and dependencies
```

## Environment Variables

Create local environment files from the examples. Real `.env` files are ignored and must not be committed.

```bash
cp .env.example .env
cp server/.env.example server/.env
```

### Frontend `.env`

| Variable | Purpose | Example |
| --- | --- | --- |
| `API_ORIGIN` | API origin used by the frontend | `http://localhost:5009` |
| `PUBLIC_URL` | Frontend public URL | `http://localhost:1234` |
| `GOOGLE_MAPS_API_KEY` | Google Maps browser API key | empty for local UI without maps |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | empty disables Google login |
| `FACEBOOK_APP_ID` | Facebook app ID | empty disables Facebook login |

### API `server/.env`

| Variable | Purpose | Example |
| --- | --- | --- |
| `PORT` | API HTTP port | `5009` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/localdonation` |
| `TOKEN_KEY` | JWT signing secret | use a long random value |
| `TOKEN_Time` | JWT lifetime | `1h` |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins | `http://localhost:1234,http://127.0.0.1:1234` |
| `JSON_BODY_LIMIT` | Express JSON body limit | `1mb` |
| `websiteLink` | Public frontend URL used in email links | `http://localhost:1234` |
| `MAIL_JET_KEY1` | Mailjet API key | production only |
| `MAIL_JET_KEY2` | Mailjet API secret | production only |
| `Email_Name` | Sender email/name config | production only |
| `GOOGLE_CLIENT_ID` | Google OAuth verification client ID | optional |
| `FACEBOOK_APP_ID` | Facebook app ID | optional |
| `FACEBOOK_APP_SECRET` | Facebook app secret | optional |
| `FACEBOOK_API_VERSION` | Facebook Graph API version | `v24.0` |

## Installation

Install frontend dependencies from the repository root:

```bash
npm ci
```

Install API dependencies:

```bash
cd server
npm ci
```

## Running Locally

Start MongoDB first. With a local MongoDB installation, the default API config expects:

```text
mongodb://127.0.0.1:27017/localdonation
```

Start the API:

```bash
cd server
npm start
```

The API should be available at:

```text
http://localhost:5009
```

Health check:

```bash
curl http://localhost:5009/health
```

Start the frontend in another terminal:

```bash
npm run dev -- --host 127.0.0.1 --port 1234
```

The frontend should be available at:

```text
http://127.0.0.1:1234
```

## Scripts

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start Parcel development server |
| `npm run build` | Create production frontend build in `dist/` |
| `npm run start` | Alias for Parcel development server |
| `npm run deploy` | Publish `dist/` with `gh-pages` |

### API

Run these from `server/`.

| Command | Description |
| --- | --- |
| `npm start` | Start the Express API |
| `npm run dev` | Start API with `nodemon` |
| `npm run check` | Syntax-check all server JavaScript files |
| `npm test` | Run API tests with Node's test runner |

## Main API Endpoints

All API routes are mounted under `/api`.

### Auth and User Routes

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/userAuth/registerByEmail` | Register with email, username, and password |
| `POST` | `/api/userAuth/loginByEmail` | Sign in with email/username and password |
| `POST` | `/api/userAuth/registerByGoogle` | Register or sign in with Google |
| `POST` | `/api/userAuth/registerByFb` | Register or sign in with Facebook |
| `POST` | `/api/userAuth/checkemail` | Check whether username/email exists |
| `POST` | `/api/userAuth/updateuserinfo` | Update authenticated profile data |
| `GET` | `/api/userAuth/getSingleUserDetail/:userId` | Fetch public profile details |
| `POST` | `/api/userAuth/updatepassword` | Complete password reset |

### Post, Donation, Vote, and Comment Routes

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/post/uploadPost` | Create a suggestion with image upload |
| `GET` | `/api/post/getAllPost/:counter/:lat/:long` | Fetch newest suggestions, optionally by location |
| `GET` | `/api/post/getAllMostPopularPost/:counter` | Fetch popular suggestions |
| `GET` | `/api/post/getOneSuggestion/:Id` | Fetch one suggestion |
| `GET` | `/api/post/getApproveSuggestion/:Id` | Compatibility alias for one suggestion |
| `POST` | `/api/post/bidOnPost` | Pledge a donation amount |
| `GET` | `/api/post/getBidders/:Id` | Fetch supporters for a suggestion |
| `POST` | `/api/post/upVote` | Toggle authenticated post upvote |
| `POST` | `/api/post/downVote` | Toggle authenticated post downvote |
| `GET` | `/api/post/getUpvoterList/:Id` | Fetch post upvoters |
| `GET` | `/api/post/getDownvoterList/:Id` | Fetch post downvoters |
| `POST` | `/api/post/uploadComment` | Add a comment to a suggestion |
| `GET` | `/api/post/getComments/:Id` | Fetch comments for a suggestion |
| `POST` | `/api/post/upVoteonComment` | Toggle authenticated comment upvote |
| `POST` | `/api/post/downVoteonComment` | Toggle authenticated comment downvote |
| `GET` | `/api/post/getUpvoterListComments/:Id` | Fetch comment upvoters |
| `GET` | `/api/post/getDownvoterListComments/:Id` | Fetch comment downvoters |
| `POST` | `/api/post/uploadReply` | Add a reply to a comment |
| `POST` | `/api/post/sendReport` | Report a suggestion or comment |
| `GET` | `/api/post/verify-post/:Id` | Admin-only suggestion approval |

### Email Routes

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/email/applyforgetpass` | Start password reset email flow |
| `GET` | `/api/email/verify/:email/uniqueid/:uniqueId` | Verify email address |

## Authentication

Protected API routes require a JWT in the `Authorization` header:

```text
Authorization: Bearer <token>
```

The frontend stores the authenticated user and token in local storage under the `LocalDonation` key.

## File Uploads

Uploaded post and profile images are stored at runtime in:

```text
server/images/
```

Only `server/images/.gitkeep` belongs in git. Uploaded files are runtime data and are ignored by `.gitignore`.

## Build and Deployment Notes

Build the frontend:

```bash
npm run build
```

The build output is written to `dist/` and is intentionally ignored. Deploy the generated output with your hosting provider or the existing `npm run deploy` script.

For the API, deploy the `server/` app with these production requirements:

- Set all required environment variables.
- Use a strong `TOKEN_KEY`.
- Use a production MongoDB instance.
- Set `CORS_ORIGINS` to the deployed frontend origin only.
- Configure Mailjet credentials if email verification and password reset emails should be sent.
- Persist `server/images/` outside the application release directory if uploaded files must survive deployments.

## Git Hygiene

The repository intentionally ignores:

- Dependency folders: `node_modules/`, `server/node_modules/`
- Build output: `dist/`, `server/build/`
- Parcel/cache output: `.parcel-cache/`, `.cache/`, `.npm-cache/`
- Local env files: `.env`, `.env.*` except `.env.example`
- Runtime uploads: `server/images/*` except `.gitkeep`
- OS/editor noise: `.DS_Store`, logs, coverage, temporary archives, and `.bak` files

Before pushing, run:

```bash
git status --short
npm run build
cd server && npm run check && npm test
```

## Troubleshooting

### API cannot connect to MongoDB

Confirm MongoDB is running and `MONGO_URI` is correct. The default local URI is:

```text
mongodb://127.0.0.1:27017/localdonation
```

### Frontend requests fail with CORS errors

Make sure the frontend origin is included in `server/.env`:

```text
CORS_ORIGINS=http://localhost:1234,http://127.0.0.1:1234
```

Restart the API after changing environment variables.

### Social login buttons are disabled or fail

Set the matching frontend and backend OAuth values:

- `GOOGLE_CLIENT_ID`
- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`

### Emails are not sent

Set Mailjet credentials in `server/.env`. In local development, missing email credentials should not block basic API work, but production email flows need valid values.

## License

MIT License.

Copyright (c) LocalPetition UG (haftungsbeschraenkt).
