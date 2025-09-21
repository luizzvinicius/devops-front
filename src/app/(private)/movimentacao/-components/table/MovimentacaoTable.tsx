import type { AnyFormApi } from "@tanstack/react-form";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { ContaMovimentacoesDto } from "@/models/conta-model";
import { showDateFormatted } from "@/utils/util";

type MovimentacoesColumns = ContaMovimentacoesDto & {
	form: AnyFormApi;
};

export const columns: ColumnDef<MovimentacoesColumns>[] = [
	{
		accessorKey: "contaId",
		header: "Conta",
		cell: ({ row }) => {
			return <div>{row.original.contaId}</div>;
		},
	},
	{
		accessorKey: "movimentacaoId",
		header: "Id movimentação",
		cell: ({ row }) => {
			return <div>{row.original.movimentacaoId}</div>;
		},
	},
	{
		accessorKey: "valor",
		header: "Valor",
		cell: ({ row }) => {
			const valorOriginal = row.original.valor;
			const color = valorOriginal > 0 ? "text-green-300" : "text-red-300";
			const valor = valorOriginal > 0 ? valorOriginal : Math.abs(valorOriginal);
			return (
				<div className={`${color}`}>
					{valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
				</div>
			);
		},
	},
	{
		accessorKey: "dataMovimentacao",
		header: "Data",
		cell: ({ row }) => {
			const data = new Date(row.original.dataMovimentacao);
			return <div>{showDateFormatted(data)}</div>;
		},
	},
];

export default function MovimentacoesTable({
	movimentacoes,
	form,
}: {
	movimentacoes: ContaMovimentacoesDto[];
	form: AnyFormApi;
}) {
	const data = movimentacoes.map(mov => ({
		...mov,
		form,
	}));
	return <DataTable columns={columns} data={data} searchFields={[]} />;
}
