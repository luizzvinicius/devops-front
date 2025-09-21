import { format } from "date-fns";

export function showCpfFormatted(cpf: string) {
	return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`;
}

export function showDateFormatted(date: Date) {
	return format(date, "dd/MM/yyyy hh:mm:ss");
}
