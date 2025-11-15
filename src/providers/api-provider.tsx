"use client";
import { useEffect } from "react";
import { api } from "@/lib/api";

export function ApiProvider() {
	useEffect(() => {
        if(window?.__env__?.CLIENT_BASE_URL) {
			api.defaults.baseURL = window.__env__.CLIENT_BASE_URL;
		}
	}, []);
	return null;
}
