import { getAdminPassword, getAdminToken, getAdminUsername } from "./env.js";

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

type BasicAuthCredentials = {
  username: string;
  password: string;
};

export function readBasicAuthCredentials(
  headers: HeadersLike,
): BasicAuthCredentials | null {
  const authorization = getHeader(headers, "authorization");
  if (!authorization) {
    return null;
  }

  const match = authorization.match(/^Basic\s+(.+)$/i);
  if (!match?.[1]) {
    return null;
  }

  try {
    const decoded = Buffer.from(match[1], "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex <= 0) {
      return null;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

export function validateAdminToken(headers: HeadersLike) {
  const expectedToken = getAdminToken();
  const expectedUsername = getAdminUsername();
  const expectedPassword = getAdminPassword();

  const providedToken = readAdminTokenFromHeaders(headers);
  if (expectedToken && providedToken === expectedToken) {
    return {
      ok: true as const,
    };
  }

  const basicAuth = readBasicAuthCredentials(headers);
  if (
    basicAuth &&
    basicAuth.username === expectedUsername &&
    basicAuth.password === expectedPassword
  ) {
    return {
      ok: true as const,
    };
  }

  if (!expectedToken && (!expectedUsername || !expectedPassword)) {
    return {
      ok: false as const,
      status: 503,
      message: "Admin credentials are not configured.",
    };
  }

  return {
    ok: false as const,
    status: 401,
    message: "Unauthorized",
  };
}
