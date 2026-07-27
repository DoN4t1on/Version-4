# Repository Cleanup Plan

This document is the handoff for the remaining cleanup work in this repo.
It is written so another model can continue without needing the prior chat.

## Current State

### Already completed

- Backend feature cleanup:
  - Removed copied, unused API-plan, account, sample-data, disease, treatment, and social-query modules.
  - Removed stale backup files and the archived `src.zip`.
  - Removed committed runtime uploads from `server/images`.
- Backend structural cleanup:
  - Renamed active models to clearer names:
    - `Post`
    - `Comment`
    - `Reply`
    - `Pledge`
  - Renamed controller and route files to clearer names:
    - `auth.controller.js`
    - `email.controller.js`
    - `post.controller.js`
    - `auth.routes.js`
    - `email.routes.js`
    - `post.routes.js`
  - Renamed email service and validation helpers to clearer names.
  - Removed dangerous bulk user deletion behavior.
- Verification completed:
  - `server` syntax check passed.
  - `server` tests passed.
  - Frontend Parcel production build passed.
  - `npm audit` is clean on both frontend and backend.

### Important compatibility note

- The code now uses clean field names.
- If old stored records still exist in a live database, a one-time migration may still be needed.

## What Still Needs Work

### 1. Frontend cleanup

The frontend still contains a number of copy-paste artifacts and outdated patterns.
They are not breaking the build, but they make review harder.

Tasks:

- Remove remaining duplicate imports and stale comments in page components.
- Normalize the biggest page files that still carry copy-paste structure:
  - `src/Suggestion.js`
  - `src/Comment.js`
  - `src/CreateASuggestion.js`
  - `src/SetLocation.js`
  - `src/YourProfile.js`
  - `src/SocialLogin.js`
  - `src/Suggestions*.js`
  - `src/Upvoter*.js`
  - `src/Downvoter*.js`
  - `src/Supporters.js`
  - `src/Report.js`
- Remove dead commented blocks that are only left from earlier experiments.
- Clean repeated UI text / helper messages so they live in one place instead of being duplicated.

### 2. API naming consistency

The active code no longer uses the old typo fields.
Only a final decision remains on whether old stored records need a migration.

Tasks:

- Confirm whether any persisted production records still need a one-time migration into the new field names.
- If they do, add the migration before changing the API contract again.
- If a rename is chosen, add a migration plan before changing the API contract.

### 3. Shared UI/service cleanup

Some common strings and helper logic are still repeated across pages.

Tasks:

- Extract repeated login / redirect messaging into a shared helper.
- Review `src/config/config.js` and other shared config files for hardcoded constants.
- Check whether all shared hooks in `src/hooks/` are still the right abstraction boundary.

### 4. Final review pass

Once the frontend cleanup is done, run a final consistency pass.

Tasks:

- Search for duplicate imports and unused variables.
- Check for dead files that are still referenced nowhere.
- Confirm that the app still builds cleanly after each structural change.

## Recommended Work Order

1. Clean the largest frontend pages first.
2. Remove remaining duplicate imports and dead comments.
3. Decide on any remaining legacy naming migration.
4. Add any migration code only after the naming decision is final.
5. Re-run build, tests, and a final search for stale references.

## Files To Start With

- `src/Suggestion.js`
- `src/Comment.js`
- `src/CreateASuggestion.js`
- `src/SetLocation.js`
- `src/YourProfile.js`
- `src/SocialLogin.js`
- `src/Suggestions.js`
- `src/SuggestionsActiveNewest.js`
- `src/SuggestionsActiveMostPopular.js`
- `src/NavbarBottom.js`
- `src/Report.js`

## Verification Checklist

- `cd server && npm test`
- `cd server && npm run check`
- `npm run build`
- `rg -n "TODO|FIXME|;;;;|useNavigate, useNavigate|useDispatch, useSelector.*useDispatch, useSelector" src server`
- `rg -n "newUser|newPost|mailJetEmail|EmailTemplates|userAuthService|checkApiKey|deleteAllUsers|apiPlan|sampleData|disease|treatment|socialQuery" src server`

## Practical Summary

- Backend cleanup: done.
- Backend verification: done.
- Frontend cleanup: partially done.
- Remaining work: mostly frontend structure and any final data migration for old stored records.
- Estimated remaining effort: about 1 focused cleanup pass, plus a migration pass only if old persisted data must be converted.
