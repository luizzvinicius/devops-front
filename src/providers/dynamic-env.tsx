import Script from "next/script";

export function DynamicClientEnvironmentProvider({
	initialEnv,
}: {
	initialEnv: Record<string, unknown>;
}) {
	return (
		<Script id="dynamic-client-environment">
			{`window.__env__ = ${JSON.stringify(initialEnv)}`}
		</Script>
	);
}
