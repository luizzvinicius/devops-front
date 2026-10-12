import { columns } from "./columns";
import type { InvestimentoRow } from "@/models/investimento-model";
import { useState } from "react";
import { DataTable } from "./data-table";
import z from "zod";

export const investimentoModalSchema = z
	.object({
		valor: z.number(),
	})
	.required();

export default function investimentoTable({ investimentos }: { investimentos: InvestimentoRow[] }) {
	const [openDialogId, setOpenDialogId] = useState<number | null>(null);

	const data =
		!investimentos ||
			investimentos.length === 0 ||
			(investimentos.length === 1 && investimentos[0].tipoInvestimento === "0")
			? []
			: investimentos;

	return (
		<DataTable columns={columns(openDialogId, setOpenDialogId)} data={data} />
	);
}
