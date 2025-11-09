import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { showDateFormatted } from "@/utils/util";
import { Button } from "@/components/ui/button";
import type { InvestimentoRow } from "@/models/investimento-model";

type InvestimentosColumns = InvestimentoRow;

export const columns: ColumnDef<InvestimentosColumns>[] = [
	{
		accessorKey: "contaId",
		header: "Conta",
		cell: ({ row }) => {
			return <div>{row.original.idConta}</div>;
		},
	},
	{
		accessorKey: "tipoInvestimento",
		header: "Tipo investimento",
		cell: ({ row }) => {
			return <div>{row.original.tipoInvestimento}</div>;
		},
	},
	{
		accessorKey: "totalInvestido",
		header: "Total investido",
		cell: ({ row }) => {
			const valor = row.original.totalInvestido;
			return (
				<div>{valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
			);
		},
	},
	{
		accessorKey: "resgate",
		header: "Data de resgate",
		cell: ({ row }) => {
			const data = new Date(row.original.resgate);
			return <div>{showDateFormatted(data)}</div>;
		},
	},
	{
		header: "Detalhes",
		cell: () => {
			return (
				<div>
					<Button className="bg-background-tertiary">Mais detalhes</Button>
				</div>
			);
		},
	},
];

export default function investimentoTable({ investimentos }: { investimentos: InvestimentoRow[] }) {
	const data = investimentos[0].idConta === "" ? [] : investimentos;
	return <DataTable columns={columns} data={data} searchFields={[]} />;
}
