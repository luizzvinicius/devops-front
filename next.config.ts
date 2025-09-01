import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// decrease the size of the docker image
	output: 'standalone',
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