import { createSign } from "node:crypto";

const tokenEndpoint = "https://oauth2.googleapis.com/token";

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function serviceAccountFromEnv() {
  const raw = String(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "").trim();
  if (!raw) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    try { parsed = JSON.parse(Buffer.from(raw, "base64").toString("utf8")); }
    catch { throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON or base64-encoded JSON"); }
  }
  if (!parsed.client_email || !parsed.private_key) throw new Error("Service account JSON is missing client_email or private_key");
  return parsed;
}

export async function getGoogleAccessToken(scopes) {
  const account = serviceAccountFromEnv();
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(JSON.stringify({
    iss: account.client_email,
    scope: Array.isArray(scopes) ? scopes.join(" ") : scopes,
    aud: tokenEndpoint,
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claims}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const assertion = `${unsigned}.${signer.sign(account.private_key).toString("base64url")}`;
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const payload = await response.json();
  if (!response.ok || !payload.access_token) throw new Error(`Google OAuth failed (${response.status}): ${payload.error_description || payload.error || "unknown error"}`);
  return payload.access_token;
}
