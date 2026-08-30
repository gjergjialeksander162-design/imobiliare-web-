import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "admin_session";

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "admin123";
}

function token(password: string): string {
  return createHash("sha256").update(`${password}::domus-admin`).digest("hex");
}

function equal(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function verifyPassword(password: string): boolean {
  return equal(token(password), token(adminPassword()));
}

export async function isAuthenticated(): Promise<boolean> {
  const cookie = (await cookies()).get(COOKIE)?.value;
  return Boolean(cookie) && equal(cookie as string, token(adminPassword()));
}

export async function startSession(): Promise<void> {
  (await cookies()).set(COOKIE, token(adminPassword()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
