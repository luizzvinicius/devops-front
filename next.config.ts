import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// biome-ignore lint/suspicious/useAwait: <explanation>
	async redirects() {
		return [
			{
				source: "/",
				destination: "/movimentacao",
				permanent: true,
			},
		];
	},
};

export default nextConfig;