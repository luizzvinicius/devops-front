export const {
	PORT = 8080,
	API_SUFFIX = "api/v1",
	BASE_URL = `http://backend:${PORT}/${API_SUFFIX}`,
	DEV_MODE = process.env.NODE_ENV === "development",
} = process.env;
