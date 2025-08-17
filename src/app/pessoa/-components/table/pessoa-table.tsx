"use client";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { PessoaResponseDto } from "@/models/pessoa-model";
import { Button } from "@/components/ui/button";
import type { AnyFormApi } from "@tanstack/react-form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

type PessoaColumn = PessoaResponseDto & {
	form: AnyFormApi;
	isDialogOpen: boolean;
	setIsDialogOpen: (isDialogOpen: boolean) => void;
	deletePessoa: (id: number) => void;
};

export const columns: ColumnDef<PessoaColumn>[] = [
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
			const cpf = row.original.cpf;
			return (
				<div>{`${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`}</div>
			);
		},
	},
	{
		accessorKey: "endereco",
		header: "Endereço",
		cell: ({ row }) => {
			return <div>{row.original.endereco}</div>;
		},
	},
	{
		header: "Editar",
		cell: ({ row }) => {
			return (
				<Button
					variant="outline"
					size="sm"
					onClick={_ => {
						row.original.form.reset({
							id: row.original.id,
							name: row.original.nome,
							cpf: row.original.cpf,
							address: row.original.endereco,
						});
					}}
				>
					Editar
				</Button>
			);
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
						<DialogDescription>Cadastro de pessoas</DialogDescription>
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
									row.original.deletePessoa(row.original.id);
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

export default function PessoaDataTable(pessoas: { pessoas: PessoaColumn[] }) {
	return (
		<DataTable
			columns={columns}
			data={pessoas.pessoas}
			searchFields={["nome", "cpf", "endereco"]}
		/>
	);
}
