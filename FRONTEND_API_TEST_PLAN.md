# Frontend API Test Plan

## Goal
Verify every user-facing feature from the frontend against the backend API, with one clear test path per function.

This plan is written so another LLM or engineer can execute it without guessing.

## Assumptions
- Frontend is served from `http://127.0.0.1:1235/`
- Backend is served from `http://127.0.0.1:5009/`
- MongoDB is running and the backend can connect
- `LocalDonation` is the active localStorage key for auth state

## Test order
Run the checks in this order:
1. App boot and feed loading
2. Registration and login
3. Profile read/update
4. Post creation
5. Post interaction: comment, reply, vote, bid
6. Report flow
7. Accepted / rejected / approved / single-post views
8. Password reset flow
9. Geolocation and map-driven screens
10. Admin approval path

## What to inspect for every request
- Browser Network tab: request URL, status code, response body
- Request headers: especially `Authorization`, `Content-Type`, `Cache-Control`
- localStorage: `LocalDonation`
- UI state after success: list refresh, navigation, toast, counters

## API coverage map

### 1. Auth
Frontend:
- `Signup.js`
- `Signin.js`
- `SocialLogin.js`
- `hooks/useCreateEmailAccount.js`
- `hooks/useLoginEmailAccount.js`
- `hooks/useCreateGoogleAccount.js`
- `hooks/useCreateFacebookAccount.js`
- `hooks/useCheckEmail_UserNameAccount.js`

Backend:
- `POST /api/userAuth/registerByEmail`
- `POST /api/userAuth/loginByEmail`
- `POST /api/userAuth/registerByGoogle`
- `POST /api/userAuth/registerByFb`
- `POST /api/userAuth/checkemail`

Checks:
- register with fresh email and username
- login with email and password
- confirm `LocalDonation.token` is stored
- confirm login-required screens stop showing anonymous warnings
- confirm duplicate email or username returns a user-friendly error

### 2. Password reset
Frontend:
- password reset page(s) linked from login / profile

Backend:
- `POST /api/email/applyforgetpass`
- `GET /api/email/verify/:email/uniqueid/:uniqueId`
- `POST /api/userAuth/updatepassword`

Checks:
- request reset for a valid email
- verify the reset link route redirects correctly
- submit new password
- confirm old password no longer works

### 3. Current user and profile
Frontend:
- `Profile.js`
- `YourProfile.js`
- `hooks/useUploadPost.js` is not profile-related, but uses the same auth store

Backend:
- `GET /api/userAuth/getSingleUserDetail/:userId`
- `POST /api/userAuth/updateuserinfo`

Checks:
- open user profile by id
- update name, address, link, description, and image
- confirm the updated values reload after refresh
- confirm the auth token survives the update

### 4. Landing feed
Frontend:
- `Suggestions.js`
- `SuggestionsActiveNewest.js`
- `SuggestionsActiveMostPopular.js`

Backend:
- `GET /api/post/getAllPost/:counter/:lat/:long`
- `GET /api/post/getAllMostPopularPost/:counter`

Checks:
- landing page loads posts
- newest feed advances with pagination / polling
- popular feed orders by votes
- only approved/public posts appear if that is the intended policy
- no infinite polling loop after the end of data

### 5. Single post
Frontend:
- `SuggestionsSingle.js`
- `Suggestion.js`

Backend:
- `GET /api/post/getOneSuggestion/:Id`

Checks:
- open a post detail page
- confirm creator data loads
- confirm like/dislike/support counters render

### 6. Create post
Frontend:
- `CreateASuggestion.js`
- `SetLocation.js`
- `hooks/useUploadPost.js`

Backend:
- `POST /api/post/uploadPost`

Checks:
- submit title, description, image, latitude, longitude
- confirm `Authorization: Bearer <token>` is present
- confirm file upload uses multipart form data
- confirm new post appears in feed after refresh
- confirm oversize files return a clean client error

### 7. Comments and replies
Frontend:
- `Comments.js`
- `Comment.js`
- `Supporters.js`
- `Upvoter.js`
- `Downvoter.js`
- `UpvoterComments.js`
- `DownvoterComments.js`

Backend:
- `POST /api/post/uploadComment`
- `GET /api/post/getComments/:Id`
- `POST /api/post/uploadReply`
- `GET /api/post/getBidders/:Id`

Checks:
- add a comment
- confirm comment count updates
- add a reply
- confirm the reply is accepted by the API
- confirm the reply is visible in whatever thread UI renders it, or confirm it in the database if the UI does not expose a reply list
- load bidder/supporter lists

### 8. Voting and pledges
Frontend:
- `Suggestion.js`
- `Comment.js`

Backend:
- `POST /api/post/bidOnPost`
- `POST /api/post/upVote`
- `POST /api/post/downVote`
- `POST /api/post/upVoteonComment`
- `POST /api/post/downVoteonComment`

Checks:
- pledge a donation amount
- upvote and downvote a post
- upvote and downvote a comment
- confirm counters update after the request returns
- confirm repeated clicks toggle consistently

### 9. Reporting and sharing
Frontend:
- `Report.js`
- `Share.js`

Backend:
- `POST /api/post/sendReport`

Checks:
- open report screen from a post
- submit a report link
- confirm the API accepts the payload
- confirm the UI shows success feedback

### 10. Admin approval
Frontend:
- `SuggestionsApprove.js`
- any admin page linked from the navigation

Backend:
- `GET /api/post/verify-post/:Id`

Checks:
- approve a pending post as admin
- confirm status changes to approved
- confirm the approved item appears in the public feed

### 11. Location and map
Frontend:
- `Maps.js`
- `SetLocation.js`
- `Address.js`
- `Header` / `NavbarTop`

Backend:
- no direct backend endpoint for geocode itself
- feed endpoint uses `lat` / `long` parameters

Checks:
- geolocation prompt works
- map selection updates state
- location name is stored in Redux
- feed still loads when geolocation is missing

## Failure triage
When a feature fails, classify it first:
1. `401` or missing token: auth storage/header problem
2. `403`: admin/auth policy problem
3. `404`: wrong route or wrong id
4. `413`: file too large
5. `422`: request validation failed
6. `500`: backend runtime error
7. CORS / preflight: origin or header mismatch

## Suggested execution workflow
For each screen:
1. Open the page in the browser.
2. Perform the action once.
3. Capture the request in Network tab.
4. Compare the payload to the backend validator/controller expectations.
5. Confirm the UI refreshes or shows the expected toast.
6. Repeat once with invalid input to verify the error path.

## End state
The app is acceptable only when:
- every visible button or form maps to a working request
- every request has a documented success and failure case
- the feed, auth, profile, post creation, and interaction flows all complete without uncaught errors
