# LocalDonation Web

LocalDonation web application with a Parcel/React frontend and an Express/MongoDB API.

## Requirements

- Node.js >=24 <25
- npm >=11
- MongoDB running locally or a MongoDB connection string

## Project Structure

- `src/` - frontend application
- `server/` - API application
- `server/images/.gitkeep` - keeps the upload directory in git; uploaded images are ignored

## Frontend Setup

```sh
npm install
npm run dev
```

The frontend runs on Parcel's default development server. API requests use `API_ORIGIN` when set, otherwise `http://localhost:5009`.

## API Setup

```sh
cd server
cp .env.example .env
npm install
npm run dev
```

Update `server/.env` with the correct MongoDB URI, token secret, CORS origins, and any OAuth or Mailjet keys needed for your environment.

## Build

```sh
npm run build
```

Build output is written to `dist/` and is intentionally ignored by git.

## Git Notes

Dependency folders, build output, local environment files, logs, OS files, and runtime uploads are ignored. Commit source files, lockfiles, and `.env.example` files.

Project board: https://github.com/orgs/LocalDonation-Dev/projects/1

## License

MIT License

Copyright (c) LocalPetition UG (haftungsbeschränkt)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
