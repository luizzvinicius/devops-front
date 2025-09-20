import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action";

export const actionClient = createSafeActionClient({
	handleServerError(e) {
		console.error("Action error:", e);
		return DEFAULT_SERVER_ERROR_MESSAGE;
	},
});
