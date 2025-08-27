"use client";
import type { AnyFormApi } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { ContaMovimentacoesDto } from "@/models/conta-model";
import { useState } from "react";

type MovimentacoesColumns = ContaMovimentacoesDto & {
	form: AnyFormApi;
};

export const columns = (
	openDialogId: number | null,
	setOpenDialogId: (id: number | null) => void,
	deleteMovimentacao: (id: number) => void,
): ColumnDef<MovimentacoesColumns>[] => [
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
			return <div className={`${color}`}>{valor}</div>;
		},
	},
	{
		accessorKey: "dataMovimentacao",
		header: "Data",
		cell: ({ row }) => {
			const data = row.original.dataMovimentacao;
			return <div>{data.getDate()}</div>;
		},
	},
	{
		header: "Remover",
		cell: ({ row }) => {
			const movId = row.original.movimentacaoId;
			return (
				<Dialog
					open={openDialogId === movId}
					onOpenChange={open => setOpenDialogId(open ? movId : null)}
				>
					<DialogTrigger asChild>
						<Button variant="destructive" size="sm">
							Excluir
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Confirmar Remoção</DialogTitle>
						</DialogHeader>
						<DialogDescription className="text-black">
							Tem certeza que deseja remover esta movimentação?
						</DialogDescription>
						<DialogFooter>
							<Button variant="outline" onClick={() => setOpenDialogId(null)}>
								Cancelar
							</Button>
							<Button
								variant="destructive"
								onClick={() => {
									deleteMovimentacao(movId);
									setOpenDialogId(null);
								}}
							>
								Remover movimentação
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			);
		},
	},
];

export default function MovimentacoesTable({
	movimentacoes,
	form,
	deleteMovimentacao,
}: {
	movimentacoes: ContaMovimentacoesDto[];
	form: AnyFormApi;
	deleteMovimentacao: (id: number) => void;
}) {
	const [openDialogId, setOpenDialogId] = useState<number | null>(null);
	const data = movimentacoes.map(mov => ({
		...mov,
		form,
		deleteMovimentacao,
	}));
	return (
		<DataTable
			columns={columns(openDialogId, setOpenDialogId, deleteMovimentacao)}
			data={data}
			searchFields={[]}
		/>
	);
}
