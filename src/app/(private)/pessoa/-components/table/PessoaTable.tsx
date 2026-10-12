import type { AnyFormApi } from "@tanstack/react-form";
import { columns } from "./columns";
import type { PessoaResponseDto } from "@/models/pessoa-model";
import { useState } from "react";
import { DataTable } from "./data-table";
import type { OnChangeFn, PaginationState } from "@tanstack/react-table";

export default function PessoaDataTable({
	pessoas,
	form,
	deletePessoa,
	pageCount,
	pagination,
	onPaginationChange,
}: {
	pessoas: PessoaResponseDto[];
	form: AnyFormApi;
	deletePessoa: (id: number) => Promise<void>;
	pageCount: number;
	pagination: PaginationState;
	onPaginationChange: OnChangeFn<PaginationState>;
}) {
	const [openDialogId, setOpenDialogId] = useState<number | null>(null);
	const data = pessoas.map(pessoa => ({
		...pessoa,
		form,
	}));

	return (
		<DataTable
			columns={columns(openDialogId, setOpenDialogId, deletePessoa)}
			data={data}
			pageCount={pageCount}
			pagination={pagination}
			onPaginationChange={onPaginationChange}
		/>
	);
}
