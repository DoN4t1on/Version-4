const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { after, before, test } = require('node:test');

const database = require('../config/database');
const { User, Post, EmailVerify, ForgetPassword } = require('../models');
const payloads = require('./payloads.json');

process.env.CORS_ORIGINS = 'http://127.0.0.1:1234';
process.env.TOKEN_KEY = process.env.TOKEN_KEY || 'integration-test-token-key';

const app = require('../app');

const runId = Date.now();
const testEmail = `apitest-${runId}@example.com`;
const testUsername = `apitestuser${runId}`;

const authPayloads = {
  ...payloads.auth,
  registerByEmail: {
    email: testEmail,
    username: testUsername,
    pass: payloads.auth.registerByEmail.pass,
  },
  loginByEmail: {
    username: testEmail,
    pass: payloads.auth.registerByEmail.pass,
  },
  checkemail: { username: testEmail },
  updatepassword: {
    ...payloads.auth.updatepassword,
    email: testEmail,
  },
};

const emailPayloads = {
  ...payloads.email,
  applyforgetpass: { email: testEmail },
};

let baseUrl;
let server;
let token;
let userId;
let postId;
let commentId;
let forgetPassId;
let emailVerifyId;

const jsonRequest = async (method, route, body, options = {}) => {
  const headers = {
    Accept: 'application/json',
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${baseUrl}${route}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    redirect: 'manual',
  });

  const contentType = response.headers.get('content-type') || '';
  let data;

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  return { status: response.status, data, headers: response.headers };
};

const multipartPost = async (route, fields, options = {}) => {
  const boundary = `----FormBoundary${Date.now()}`;
  const parts = [];

  Object.entries(fields).forEach(([key, value]) => {
    if (value && typeof value === 'object' && value.filename) {
      parts.push(
        `--${boundary}\r\n` +
          `Content-Disposition: form-data; name="${key}"; filename="${value.filename}"\r\n` +
          `Content-Type: ${value.contentType}\r\n\r\n`
      );
      parts.push(value.buffer);
      parts.push('\r\n');
      return;
    }

    parts.push(
      `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="${key}"\r\n\r\n` +
        `${value}\r\n`
    );
  });

  parts.push(`--${boundary}--\r\n`);

  const bodyParts = parts.map((part) =>
    typeof part === 'string' ? Buffer.from(part, 'utf8') : part
  );
  const body = Buffer.concat(bodyParts);

  const response = await fetch(`${baseUrl}${route}`, {
    method: 'POST',
    headers: {
      Authorization: options.token ? `Bearer ${options.token}` : undefined,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    },
    body,
  });

  return {
    status: response.status,
    data: await response.json(),
  };
};

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

before(async () => {
  await database.connect();
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (userId) {
    await User.deleteOne({ _id: userId });
  }
  if (postId) {
    await Post.deleteOne({ _id: postId });
  }
  await EmailVerify.deleteMany({ email: testEmail });
  await ForgetPassword.deleteMany({ email: testEmail });

  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await database.disconnect();
});

test('GET /health', async () => {
  const res = await jsonRequest('GET', '/health');
  assert.equal(res.status, 200);
  assert.deepEqual(res.data, { status: 'ok' });
});

test('POST /api/userAuth/registerByEmail', async () => {
  const res = await jsonRequest(
    'POST',
    '/api/userAuth/registerByEmail',
    authPayloads.registerByEmail
  );

  assert.equal(res.status, 200);
  assert.equal(res.data.status, true);
  assert.equal(res.data.data.email, testEmail);
  userId = res.data.data._id;
  token = res.data.data.token;
  assert.ok(token);
});

test('POST /api/userAuth/checkemail (existing user)', async () => {
  const res = await jsonRequest(
    'POST',
    '/api/userAuth/checkemail',
    authPayloads.checkemail
  );

  assert.equal(res.status, 400);
  assert.equal(res.data.data.userExist, true);
});

test('POST /api/userAuth/checkemail (new user)', async () => {
  const res = await jsonRequest(
    'POST',
    '/api/userAuth/checkemail',
    payloads.auth.checkemailNew
  );

  assert.equal(res.status, 200);
  assert.equal(res.data.data.userExist, false);
});

test('POST /api/userAuth/loginByEmail (before verify)', async () => {
  const res = await jsonRequest(
    'POST',
    '/api/userAuth/loginByEmail',
    authPayloads.loginByEmail
  );

  assert.equal(res.status, 400);
  assert.match(res.data.message, /bestätigen/i);
});

test('verify user then POST /api/userAuth/loginByEmail', async () => {
  await User.findByIdAndUpdate(userId, { verify: 'yes' });

  const res = await jsonRequest(
    'POST',
    '/api/userAuth/loginByEmail',
    authPayloads.loginByEmail
  );

  assert.equal(res.status, 200);
  assert.equal(res.data.status, true);
  token = res.data.data.token;
  assert.ok(token);
});

test('GET /api/userAuth/getSingleUserDetail/:userId', async () => {
  const res = await jsonRequest('GET', `/api/userAuth/getSingleUserDetail/${userId}`);

  assert.equal(res.status, 200);
  assert.equal(res.data.status, true);
  assert.equal(res.data.data.email, testEmail);
  assert.equal(res.data.data.pass, undefined);
});

test('POST /api/userAuth/updateuserinfo', async () => {
  const res = await multipartPost(
    '/api/userAuth/updateuserinfo',
    authPayloads.updateuserinfo,
    { token }
  );

  assert.equal(res.status, 200);
  assert.equal(res.data.status, true);
  assert.equal(res.data.data.fname, authPayloads.updateuserinfo.fname);
});

test('POST /api/post/uploadPost', async () => {
  const res = await multipartPost(
    '/api/post/uploadPost',
    {
      ...payloads.post.uploadPost,
      pics: {
        filename: 'test-post.png',
        contentType: 'image/png',
        buffer: tinyPng,
      },
    },
    { token }
  );

  assert.equal(res.status, 201);
  assert.equal(res.data.status, true);
  assert.equal(res.data.data.status, false);
  postId = res.data.data._id;
});

test('GET /api/post/getOneSuggestion/:Id', async () => {
  const res = await jsonRequest('GET', `/api/post/getOneSuggestion/${postId}`);

  assert.equal(res.status, 200);
  assert.equal(res.data.status, true);
  assert.equal(String(res.data.data[0]._id), String(postId));
});

test('GET /api/post/getApproveSuggestion/:Id', async () => {
  const res = await jsonRequest('GET', `/api/post/getApproveSuggestion/${postId}`);

  assert.equal(res.status, 200);
  assert.equal(res.data.status, true);
});

test('GET /api/post/getAllPost/:counter/:lat/:long (before approval)', async () => {
  const res = await jsonRequest('GET', '/api/post/getAllPost/0/false/false');

  assert.equal(res.status, 200);
  assert.equal(res.data.status, true);
  const ids = res.data.data.map((post) => String(post._id));
  assert.equal(ids.includes(String(postId)), false);
});

test('GET /api/post/verify-post/:Id (non-admin rejected)', async () => {
  const res = await jsonRequest('GET', `/api/post/verify-post/${postId}`, null, { token });

  assert.equal(res.status, 403);
});

test('GET /api/post/verify-post/:Id (admin approves)', async () => {
  await User.findByIdAndUpdate(userId, { isAdmin: true });

  const res = await jsonRequest('GET', `/api/post/verify-post/${postId}`, null, { token });

  assert.equal(res.status, 200);
  assert.equal(res.data.status, true);
  assert.equal(res.data.data.status, true);
});

test('GET /api/post/getAllPost/:counter/:lat/:long (after approval)', async () => {
  const res = await jsonRequest('GET', '/api/post/getAllPost/0/false/false');

  assert.equal(res.status, 200);
  const ids = res.data.data.map((post) => String(post._id));
  assert.equal(ids.includes(String(postId)), true);
});

test('GET /api/post/getAllMostPopularPost/:counter', async () => {
  const res = await jsonRequest('GET', '/api/post/getAllMostPopularPost/0');

  assert.equal(res.status, 200);
  assert.equal(res.data.status, true);
  assert.ok(Array.isArray(res.data.data));
});

test('POST /api/post/bidOnPost', async () => {
  const res = await jsonRequest(
    'POST',
    '/api/post/bidOnPost',
    { ...payloads.post.bidOnPost, postId },
    { token }
  );

  assert.equal(res.status, 201);
  assert.equal(res.data.status, true);
  assert.equal(res.data.isNew, true);
});

test('GET /api/post/getBidders/:Id', async () => {
  const res = await jsonRequest('GET', `/api/post/getBidders/${postId}`);

  assert.equal(res.status, 200);
  assert.equal(res.data.status, true);
  assert.equal(res.data.data.length, 1);
});

test('POST /api/post/upVote', async () => {
  const res = await jsonRequest(
    'POST',
    '/api/post/upVote',
    { ...payloads.post.upVote, postId },
    { token }
  );

  assert.equal(res.status, 200);
  assert.equal(res.data.status, true);
  assert.equal(res.data.data[0].upvotes.length, 1);
});

test('GET /api/post/getUpvoterList/:Id', async () => {
  const res = await jsonRequest('GET', `/api/post/getUpvoterList/${postId}`);

  assert.equal(res.status, 200);
  assert.equal(res.data.data.length, 1);
});

test('POST /api/post/downVote', async () => {
  const res = await jsonRequest(
    'POST',
    '/api/post/downVote',
    { ...payloads.post.downVote, postId },
    { token }
  );

  assert.equal(res.status, 200);
  assert.equal(res.data.data[0].downvotes.length, 1);
  assert.equal(res.data.data[0].upvotes.length, 0);
});

test('GET /api/post/getDownvoterList/:Id', async () => {
  const res = await jsonRequest('GET', `/api/post/getDownvoterList/${postId}`);

  assert.equal(res.status, 200);
  assert.equal(res.data.data.length, 1);
});

test('POST /api/post/uploadComment', async () => {
  const res = await jsonRequest(
    'POST',
    '/api/post/uploadComment',
    { ...payloads.post.uploadComment, postId },
    { token }
  );

  assert.equal(res.status, 201);
  assert.equal(res.data.status, true);
  commentId = res.data.data._id;
});

test('GET /api/post/getComments/:Id', async () => {
  const res = await jsonRequest('GET', `/api/post/getComments/${postId}`);

  assert.equal(res.status, 200);
  assert.equal(res.data.data.length, 1);
});

test('POST /api/post/upVoteonComment', async () => {
  const res = await jsonRequest(
    'POST',
    '/api/post/upVoteonComment',
    { ...payloads.post.upVoteonComment, expId: commentId },
    { token }
  );

  assert.equal(res.status, 200);
  assert.equal(res.data.data[0].upvotecomments.length, 1);
});

test('GET /api/post/getUpvoterListComments/:Id', async () => {
  const res = await jsonRequest('GET', `/api/post/getUpvoterListComments/${commentId}`);

  assert.equal(res.status, 200);
  assert.equal(res.data.data.length, 1);
});

test('POST /api/post/downVoteonComment', async () => {
  const res = await jsonRequest(
    'POST',
    '/api/post/downVoteonComment',
    { ...payloads.post.downVoteonComment, expId: commentId },
    { token }
  );

  assert.equal(res.status, 200);
  assert.equal(res.data.data[0].downvotecomments.length, 1);
});

test('GET /api/post/getDownvoterListComments/:Id', async () => {
  const res = await jsonRequest('GET', `/api/post/getDownvoterListComments/${commentId}`);

  assert.equal(res.status, 200);
  assert.equal(res.data.data.length, 1);
});

test('POST /api/post/uploadReply', async () => {
  const res = await jsonRequest(
    'POST',
    '/api/post/uploadReply',
    { ...payloads.post.uploadReply, commentId },
    { token }
  );

  assert.equal(res.status, 201);
  assert.equal(res.data.status, true);
});

test('POST /api/post/sendReport', async () => {
  const res = await jsonRequest('POST', '/api/post/sendReport', {
    ...payloads.post.sendReport,
    link: `${payloads.post.sendReport.link}/${postId}`,
  });

  assert.equal(res.status, 200);
  assert.equal(res.data.status, true);
});

test('POST /api/email/applyforgetpass', async () => {
  const res = await jsonRequest(
    'POST',
    '/api/email/applyforgetpass',
    emailPayloads.applyforgetpass
  );

  assert.equal(res.status, 200);
  const record = await ForgetPassword.findOne({ email: testEmail }).sort({ _id: -1 });
  assert.ok(record);
  forgetPassId = String(record._id);
});

test('GET /api/userAuth/forgetpassverify/uniqueid/:uniqueId', async () => {
  const res = await jsonRequest(
    'GET',
    `/api/userAuth/forgetpassverify/uniqueid/${forgetPassId}`
  );

  assert.equal(res.status, 302);
  assert.match(res.headers.get('location'), /updatepass/);
});

test('POST /api/userAuth/updatepassword', async () => {
  const res = await jsonRequest('POST', '/api/userAuth/updatepassword', {
    ...authPayloads.updatepassword,
    pass: 'newpassword123',
    uniqueId: forgetPassId,
  });

  assert.equal(res.status, 200);
  assert.match(res.data, /geändert/i);

  authPayloads.loginByEmail.pass = 'newpassword123';
});

test('POST /api/userAuth/loginByEmail (after password reset)', async () => {
  const res = await jsonRequest(
    'POST',
    '/api/userAuth/loginByEmail',
    authPayloads.loginByEmail
  );

  assert.equal(res.status, 200);
  token = res.data.data.token;
});

test('GET /api/email/verify/:email/uniqueid/:uniqueId', async () => {
  const verifyRecord = await EmailVerify.create({ email: testEmail });
  emailVerifyId = String(verifyRecord._id);

  const res = await jsonRequest(
    'GET',
    `/api/email/verify/${encodeURIComponent(testEmail)}/uniqueid/${emailVerifyId}`
  );

  assert.equal(res.status, 200);
  assert.match(res.data, /bestätigt|Danke|Willkommen|verif/i);
});

test('POST /api/userAuth/registerByGoogle (invalid credential)', async () => {
  const res = await jsonRequest(
    'POST',
    '/api/userAuth/registerByGoogle',
    payloads.auth.registerByGoogle
  );

  assert.ok([401, 400].includes(res.status));
  assert.ok(res.data.message);
});

test('POST /api/userAuth/registerByFb (invalid token)', async () => {
  const res = await jsonRequest(
    'POST',
    '/api/userAuth/registerByFb',
    payloads.auth.registerByFb
  );

  assert.ok([401, 400].includes(res.status));
  assert.ok(res.data.message);
});

test('payloads.json documents all request bodies', () => {
  const payloadPath = path.join(__dirname, 'payloads.json');
  const raw = fs.readFileSync(payloadPath, 'utf8');
  const parsed = JSON.parse(raw);

  assert.ok(parsed.auth.registerByEmail.email);
  assert.ok(parsed.post.uploadPost.title);
  assert.ok(parsed.email.applyforgetpass.email);
});
