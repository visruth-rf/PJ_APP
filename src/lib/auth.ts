import { createHmac, timingSafeEqual } from "crypto";

import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth-constants";


type SessionPayload = {
  userId: string;
  exp: number;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is required for authentication.");
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("hex");
}

function toBase64(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

export function createSessionToken(userId: string) {
  const payload: SessionPayload = {
    userId,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  };

  const encodedPayload = toBase64(JSON.stringify(payload));
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [encodedPayload, providedSignature] = token.split(".");

  if (!encodedPayload || !providedSignature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const providedBuffer = Buffer.from(providedSignature, "utf8");

  if (expectedBuffer.length !== providedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(expectedBuffer, providedBuffer)) {
    return null;
  }

  const payload = JSON.parse(fromBase64(encodedPayload)) as SessionPayload;

  if (payload.exp <= Date.now()) {
    return null;
  }

  return payload;
}

export function getSessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    maxAge: SESSION_MAX_AGE_SECONDS,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/"
  };
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}
