import { cookies } from "next/headers";

// The ingredients someone has at home, kept in a cookie so the bar works
// without an account.
const BAR_COOKIE = "bar";

// More than there are ingredients today, and still under the 4 KB cookie limit
// (150 ids take 3,200 characters).
export const MAX_BAR_SIZE = 150;

// Ids are packed as their 16 raw bytes in base64url, about 21 characters each
// instead of 36, so that a bar with every ingredient fits in one cookie.
function encodeBar(ids: string[]) {
  const hex = ids.map((id) => id.replaceAll("-", "")).join("");
  return Buffer.from(hex, "hex").toString("base64url");
}

function decodeBar(value: string | undefined) {
  const hex = Buffer.from(value ?? "", "base64url").toString("hex");
  const ids: string[] = [];
  for (let i = 0; i + 32 <= hex.length && ids.length < MAX_BAR_SIZE; i += 32) {
    const h = hex.slice(i, i + 32);
    ids.push(
      `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`,
    );
  }
  return ids;
}

// Ingredient ids in the visitor's bar. Ids that no longer exist are harmless:
// they just don't match anything.
export async function getBar() {
  return decodeBar((await cookies()).get(BAR_COOKIE)?.value);
}

// Only callable from a server action.
export async function saveBar(ids: string[]) {
  const cookieStore = await cookies();
  if (ids.length === 0) {
    cookieStore.delete(BAR_COOKIE);
    return;
  }
  cookieStore.set(BAR_COOKIE, encodeBar(ids), {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
