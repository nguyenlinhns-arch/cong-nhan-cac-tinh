import fs from 'node:fs';
import crypto from 'node:crypto';

const FEED_PATH = 'tuyen-tho-mo/jobs.json';
const rawSecret = String(process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON || '').trim();

if (!rawSecret) {
  console.log('Google Indexing API: chưa cấu hình GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON, bỏ qua gửi URL.');
  process.exit(0);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(rawSecret);
} catch (error) {
  console.error('GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON không phải JSON hợp lệ.');
  process.exit(1);
}

for (const field of ['client_email', 'private_key']) {
  if (!serviceAccount[field]) {
    console.error(`Service account thiếu trường ${field}.`);
    process.exit(1);
  }
}

const base64url = value => Buffer.from(value).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
const payload = base64url(JSON.stringify({
  iss: serviceAccount.client_email,
  scope: 'https://www.googleapis.com/auth/indexing',
  aud: serviceAccount.token_uri || 'https://oauth2.googleapis.com/token',
  iat: now,
  exp: now + 3600,
}));
const unsigned = `${header}.${payload}`;
const signature = crypto.sign('RSA-SHA256', Buffer.from(unsigned), serviceAccount.private_key).toString('base64url');
const assertion = `${unsigned}.${signature}`;

const tokenResponse = await fetch(serviceAccount.token_uri || 'https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  }),
});

if (!tokenResponse.ok) {
  console.error('Không lấy được access token:', tokenResponse.status, await tokenResponse.text());
  process.exit(1);
}

const { access_token: accessToken } = await tokenResponse.json();
const feed = JSON.parse(fs.readFileSync(FEED_PATH, 'utf8'));
const jobs = Array.isArray(feed.jobs) ? feed.jobs : [];
const activeJobs = jobs.filter(job => job.status === 'open' && job.url && (!job.valid_through || new Date(job.valid_through).getTime() > Date.now()));

if (!activeJobs.length) {
  console.log('Google Indexing API: không có tin tuyển dụng đang mở để gửi.');
  process.exit(0);
}

let failed = 0;
for (const job of activeJobs) {
  const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ url: job.url, type: 'URL_UPDATED' }),
  });

  const body = await response.text();
  if (!response.ok) {
    failed += 1;
    console.error(`FAILED ${response.status} ${job.url}: ${body}`);
  } else {
    console.log(`SUBMITTED ${job.url}`);
  }
}

if (failed) process.exit(1);
