import { getAdminToken } from "./env.js";

type HeadersLike = Record<string, unknown> | undefined;

function getHeader(headers: HeadersLike, name: string) {
  if (!headers) {
    return null;
  }

  const direct = headers[name];
  if (typeof direct === "string") {
    return direct;
  }

  const lower = headers[name.toLowerCase()];
  if (typeof lower === "string") {
    return lower;
  }

  return null;
}

export function readAdminTokenFromHeaders(headers: HeadersLike) {
  const explicitToken = getHeader(headers, "x-admin-token");
  if (explicitToken) {
    return explicitToken.trim();
  }

  const authorization = getHeader(headers, "authorization");
  if (!authorization) {
    return null;
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

export function validateAdminToken(headers: HeadersLike) {
  const expectedToken = getAdminToken();
  if (!expectedToken) {
    return {
      ok: false as const,
      status: 503,
      message: "ADMIN_TOKEN is not configured.",
    };
  }

  const providedToken = readAdminTokenFromHeaders(headers);
  if (!providedToken || providedToken !== expectedToken) {
    return {
      ok: false as const,
      status: 401,
      message: "Unauthorized",
    };
  }

  return {
    ok: true as const,
  };
}
