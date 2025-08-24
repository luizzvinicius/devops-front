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
import type { MovimentacoesRow } from "@/models/movimentacao-model";

type MovimentacoesColumns = MovimentacoesRow & {
	form: AnyFormApi;
	isDialogOpen: boolean;
	setIsDialogOpen: (isDialogOpen: boolean) => void;
	deleteMovimentacao: (id: number) => void;
};

export const columns: ColumnDef<MovimentacoesColumns>[] = [
	{
		accessorKey: "conta_id",
		header: "Conta",
		cell: ({ row }) => {
			return <div>{row.original.conta_id}</div>;
		},
	},
	{
		accessorKey: "id",
		header: "Id movimentação",
		cell: ({ row }) => {
			return <div>{row.original.id}</div>;
		},
	},
	{
		accessorKey: "valor",
		header: "Valor",
		cell: ({ row }) => {
			return <div>{row.original.valor}</div>;
		},
	},
	{
		accessorKey: "data",
		header: "Data",
		cell: ({ row }) => {
			return <div>{row.original.data.toISOString()}</div>;
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
							Excluir movimentação
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
									row.original.deleteMovimentacao(row.original.id);
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
	movimentacoes: MovimentacoesRow[];
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
