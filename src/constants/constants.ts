export const { DEV_MODE = process.env.NODE_ENV === "development" } = process.env;

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://backend:8080/api/v1";
export const AUTH_TOKEN = "session";
