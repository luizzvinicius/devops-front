import axios from "axios";
import { clientEnvs } from "@/constants/constants";

export const api = axios.create({
	baseURL: clientEnvs.NEXT_PUBLIC_BASE_URL,
});
