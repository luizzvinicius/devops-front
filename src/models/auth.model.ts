export type LoginResponse = {
	access_token: Token;
	expires_in: number;
	refresh_expires_in: number;
	refresh_token: string;
	token_type: string;
	not_before_policy: number;
	session_state: string;
	scope: string;
};

export type Token = {
	exp: number;
	iat: number;
	jti: string;
	iss: string;
	aud: string[];
	sub: string;
	typ: string;
	azp: string;
	sid: string;
	acr: string;
	"allowed-origins": string[];
	realm_access: {
		roles: string[];
	};
	resource_access: {
		[key: string]: {
			roles: string[];
		};
	};
	scope: string;
	email_verified: boolean;
	name: string;
	preferred_username: string;
	given_name: string;
	family_name: string;
	email: string;
};
