"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputMask } from "@react-input/mask";
import { useForm } from "@tanstack/react-form";
import {
	useCreatePessoa,
	useDeletePessoa,
	useGetPessoas,
	useUpdatePessoa,
} from "../mutations/usePessoaQuery";
import { Label } from "@/components/ui/label";
import { FieldInfo } from "@/components/forms/FieldInfo";
import PessoaDataTable from "../table/PessoaTable";
import { toast } from "sonner";
import { createPessoaSchema, type CreatePessoaType, nullFormState } from "./formSchema";
import { useState } from "react";
import type { PaginationState } from "@tanstack/react-table";

export function CreatePessoaForm() {
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	const { data: pessoasResponse } = useGetPessoas(pagination.pageIndex);
	const { mutateAsync: createPessoa } = useCreatePessoa();
	const { mutateAsync: deletePessoa } = useDeletePessoa(pagination.pageIndex, () =>
		setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 })),
	);
	const { mutateAsync: updatePessoa } = useUpdatePessoa(pagination.pageIndex);

	const form = useForm({
		defaultValues: nullFormState,
		onSubmit: values => {
			onSubmit(values.value);
		},
		validators: {
			onChange: createPessoaSchema,
		},
	});

	async function onSubmit(formData: CreatePessoaType) {
		const parsed = createPessoaSchema.parse(formData);
		const pessoa = {
			nome: parsed.name,
			cpf: parsed.cpf,
			endereco: parsed.address,
		};
		if (parsed.id === 0) {
			try {
				await createPessoa(pessoa);
			} catch {
				toast.error("Erro ao criar pessoa");
			}
		} else {
			try {
				await updatePessoa({
					idparam: parsed.id,
					data: pessoa,
				});
			} catch {
				toast.error("Erro ao atualizar pessoa");
			}
		}
		form.reset(nullFormState);
	}

	return (
		<div>
			<form
				onSubmit={e => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="[&>*:nth-child(2n)]:mb-3.5"
			>
				<Label htmlFor="name" className="text-xl text-custom">
					Nome
				</Label>
				<form.Field name="name">
					{field => (
						<div>
							<Input
								id="name"
								type="text"
								value={field.state.value}
								placeholder="Nome do cliente"
								onChange={e => {
									field.handleChange(e.target.value);
								}}
								className="bg-background-secondary border-none placeholder-[#747f8f] text-custom"
							/>
							<FieldInfo fieldMeta={field.state.meta} />
						</div>
					)}
				</form.Field>

				<Label htmlFor="cpf" className="text-xl text-custom">
					CPF
				</Label>
				<form.Field name="cpf">
					{field => (
						<div>
							<InputMask
								id="cpf"
								mask="___.___.___-__"
								replacement={{ _: /\d/ }}
								component={Input}
								placeholder="CPF"
								value={field.state.value}
								onChange={e => field.handleChange(e.target.value)}
								className="bg-background-secondary border-none placeholder-[#747f8f] text-custom"
							/>
							<FieldInfo fieldMeta={field.state.meta} />
						</div>
					)}
				</form.Field>

				<Label htmlFor="address" className="text-xl text-custom">
					Endereço
				</Label>
				<form.Field name="address">
					{field => (
						<div>
							<Input
								id="address"
								type="text"
								placeholder="Endereço"
								value={field.state.value}
								onChange={e => field.handleChange(e.target.value)}
								className="bg-background-secondary border-none placeholder-[#747f8f] text-custom"
							/>
							<FieldInfo fieldMeta={field.state.meta} />
						</div>
					)}
				</form.Field>

				<div className="flex justify-center">
					<Button type="submit" className="bg-background-tertiary text-custom">
						Salvar
					</Button>
				</div>
			</form>
			<div className="h-[300px] overflow-y-auto">
				<PessoaDataTable
					pessoas={pessoasResponse.pessoas}
					form={form}
					deletePessoa={async id => {
						await deletePessoa(id);
					}}
					pageCount={pessoasResponse.pageSize && pessoasResponse.totalElements > 0 ? Math.ceil(pessoasResponse.totalElements / pessoasResponse.pageSize) : 1}
					pagination={pagination}
					onPaginationChange={setPagination}
				/>
			</div>
		</div>
	);
}
