import { addMonths, differenceInMonths, format } from "date-fns";

export function showCpfFormatted(cpf: string) {
	return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`;
}

export function showDateFormatted(date: Date) {
	return format(date, "dd/MM/yyyy hh:mm:ss");
}

export function generateChartPrevision(dataResgate: Date, totalInvestido: number, taxa: number) {
	const now = new Date();
	const differenceInMonthsNowAndEndDate = differenceInMonths(dataResgate, now);

	const result: { month: string; montante: number }[] = [
		{ month: format(now, "MMM"), montante: totalInvestido },
	];

	let amount = totalInvestido;
	let monthPrevision = "";
	for (let i = 1; i <= differenceInMonthsNowAndEndDate + 1; i++) {
		monthPrevision = format(addMonths(now, i), "MMM");
		amount *= 1 + taxa / 12;
		const rounded = Math.round(amount * 100) / 100;
		result.push({ month: monthPrevision, montante: rounded });
	}

	return result;
}
