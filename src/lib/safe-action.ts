import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action";

export const actionClient = createSafeActionClient({
	handleServerError(e, utils) {
		const { clientInput, bindArgsClientInputs, metadata, ctx } = utils;
		console.error("Action error:", e.message);
		return DEFAULT_SERVER_ERROR_MESSAGE;
	},
});
