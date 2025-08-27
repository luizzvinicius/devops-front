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

type MovimentacoesColumns = ContaMovimentacoesDto & {
	form: AnyFormApi;
	isDialogOpen: boolean;
	setIsDialogOpen: (isDialogOpen: boolean) => void;
	deleteMovimentacao: (id: number) => void;
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
			return <div className={`${color}`}>{valor}</div>;
		},
	},
	{
		accessorKey: "dataMovimentacao",
		header: "Data",
		cell: ({ row }) => {
			return <div>nada</div>;
		},
	},
	{
		header: "Remover",
		cell: ({ row }) => {
			const isDialogOpen = row.original.isDialogOpen;
			const setIsDialogOpen = row.original.setIsDialogOpen;
			return (
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
							<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
								Cancelar
							</Button>
							<Button
								variant="destructive"
								onClick={() => {
									row.original.deleteMovimentacao(row.original.movimentacaoId);
									setIsDialogOpen(false);
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
	isDialogOpen,
	setIsDialogOpen,
	deleteMovimentacao,
}: {
	movimentacoes: ContaMovimentacoesDto[];
	form: AnyFormApi;
	isDialogOpen: boolean;
	setIsDialogOpen: (isDialogOpen: boolean) => void;
	deleteMovimentacao: (id: number) => void;
}) {
	const data = movimentacoes.map(mov => ({
		...mov,
		form,
		isDialogOpen,
		setIsDialogOpen,
		deleteMovimentacao,
	}));
	return <DataTable columns={columns} data={data} />;
}
