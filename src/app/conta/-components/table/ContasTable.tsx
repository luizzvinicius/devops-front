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
import type { PessoaResponseDto } from "@/models/pessoa-model";
import { showCpfFormatted } from "@/utils/util";

type ContasColumns = PessoaResponseDto & {
	form: AnyFormApi;
	isDialogOpen: boolean;
	setIsDialogOpen: (isDialogOpen: boolean) => void;
	deleteConta: (id: number) => void;
};

export const columns: ColumnDef<ContasColumns>[] = [
	{
		accessorKey: "nome",
		header: "Nome",
		cell: ({ row }) => {
			return <div>{row.original.nome}</div>;
		},
	},
	{
		accessorKey: "cpf",
		header: "CPF",
		cell: ({ row }) => {
			return <div>{showCpfFormatted(row.original.cpf)}</div>;
		},
	},
	{
		accessorKey: "id",
		header: "Número conta",
		cell: ({ row }) => {
			return <div>{row.original.id}</div>;
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
							Remover
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogDescription>Cadastro de conta</DialogDescription>
						<DialogHeader>
							<DialogTitle>Confirmar Remoção</DialogTitle>
						</DialogHeader>
						<p>Tem certeza que deseja remover este item?</p>
						<DialogFooter>
							<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
								Cancelar
							</Button>
							<Button
								variant="destructive"
								onClick={() => {
									row.original.deleteConta(row.original.id);
									setIsDialogOpen(false);
								}}
							>
								Remover
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			);
		},
	},
];

export default function ContasTable({ contas }: { contas: ContasColumns }) {
	return <DataTable columns={columns} data={contas} searchFields={} />;
}
