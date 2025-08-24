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
import { showCpfFormatted } from "@/utils/util";
import type { PessoaContaResponse, PessoaEConta } from "@/models/pessoa-model";

type ContasColumns = PessoaEConta & {
	form: AnyFormApi;
	isDialogOpen: boolean;
	setIsDialogOpen: (isDialogOpen: boolean) => void;
	deleteConta: (id: string) => void;
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
		accessorKey: "conta.id",
		header: "Número conta",
		cell: ({ row }) => {
			return <div>{row.original.conta_id}</div>;
		},
	},
	{
		accessorKey: "conta.saldo",
		header: "Saldo",
		cell: ({ row }) => {
			return <div>{row.original.conta_saldo}</div>;
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
							Remover conta
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Confirmar Remoção</DialogTitle>
						</DialogHeader>
						<DialogDescription className="text-black">
							Tem certeza que deseja remover esta conta?
						</DialogDescription>
						<DialogFooter>
							<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
								Cancelar
							</Button>
							<Button
								variant="destructive"
								onClick={() => {
									row.original.deleteConta(row.original.conta_id);
									setIsDialogOpen(false);
								}}
							>
								Remover conta
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			);
		},
	},
];

export default function ContasTable({
	pessoaConta,
	form,
	isDialogOpen,
	setIsDialogOpen,
	deleteConta,
}: {
	pessoaConta: PessoaEConta[];
	form: AnyFormApi;
	isDialogOpen: boolean;
	setIsDialogOpen: (isDialogOpen: boolean) => void;
	deleteConta: (id: string) => void;
}) {
	const data =
		//pessoaConta.pageSize === 0
		//	? []
		pessoaConta.map(pessoa => ({
			...pessoa,
			form,
			isDialogOpen,
			setIsDialogOpen,
			deleteConta,
		}));
	return <DataTable columns={columns} data={data} searchFields={["nome", "cpf"]} />;
}
