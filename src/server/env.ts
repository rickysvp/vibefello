export function getAppUrl(port: number) {
  return process.env.APP_URL || `http://localhost:${port}`;
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}
