export const { DEV_MODE = process.env.NODE_ENV === "development" } = process.env;

export const BASE_URL = DEV_MODE ? "http://localhost:8080/api/v1" : "http://backend:8080/api/v1";
export const AUTH_TOKEN = "session";
