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
import type { PessoaEConta } from "@/models/pessoa-model";
import { useState } from "react";
import { toast } from "sonner";

type ContasTableRow = PessoaEConta & {
	form: AnyFormApi;
};

export const columns = (
	openDialogId: string | null,
	setOpenDialogId: (id: string | null) => void,
	deleteConta: (id: string) => Promise<void>,
): ColumnDef<ContasTableRow>[] => [
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
			const contaId = row.original.conta_id;
			return (
				<Dialog
					open={openDialogId === contaId}
					onOpenChange={open => setOpenDialogId(open ? contaId : null)}
				>
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
							<Button variant="outline" onClick={() => setOpenDialogId(null)}>
								Cancelar
							</Button>
							<Button
								variant="destructive"
								onClick={async () => {
									try {
										await deleteConta(contaId);
									} catch (_) {
										toast.error("Erro ao deletar conta");
									}
									setOpenDialogId(null);
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
	deleteConta,
}: {
	pessoaConta: PessoaEConta[];
	form: AnyFormApi;
	deleteConta: (id: string) => Promise<void>;
}) {
	const [openDialogId, setOpenDialogId] = useState<string | null>(null);
	const data: ContasTableRow[] =
		pessoaConta[0]?.nome === ""
			? []
			: pessoaConta.map(pessoa => ({
					...pessoa,
					form,
				}));

	return (
		<DataTable
			columns={columns(openDialogId, setOpenDialogId, deleteConta)}
			data={data}
			searchFields={["nome", "cpf"]}
		/>
	);
}
