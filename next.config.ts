import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// biome-ignore lint/suspicious/useAwait: <explanation>
	async redirects() {
		return [
			{
				source: "/",
				destination: "/pessoa",
				permanent: true,
			},
		];
	},
};

export default nextConfig;