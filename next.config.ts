import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// decrease the size of the docker image
	output: "standalone",
};

export default nextConfig;