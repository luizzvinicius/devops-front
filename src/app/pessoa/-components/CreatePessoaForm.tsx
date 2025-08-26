"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputMask } from "@react-input/mask";
import { useForm } from "@tanstack/react-form";
import { useCreatePessoa, useDeletePessoa, useGetPessoas, useUpdatePessoa } from "./usePessoaQuery";
import { Label } from "@/components/ui/label";
import { FieldInfo } from "@/components/forms/FieldInfo";
import PessoaDataTable from "./table/PessoaTable";
import { toast } from "sonner";
import { z } from "zod";

export const createPessoaSchema = z
	.object({
		id: z.number(),
		name: z
			.string()
			.min(3, "Nome mínimo de 3 caracteres")
			.max(255, "Nome deve ter no máximo 255 caracteres"),
		cpf: z
			.string()
			.trim()
			.min(11, "O CPF deve ter pelo menos 11 caracteres")
			.transform(cpf => {
				return cpf.replace(/[.\-]/g, "");
			}),
		address: z
			.string()
			.min(5, "Endereço mínimo de 5 caracteres")
			.max(255, "Endereço deve ter no máximo 255 caracteres"),
	})
	.required();

export type CreatePessoaType = z.infer<typeof createPessoaSchema>;

const nullFormState = {
	id: 0,
	name: "",
	cpf: "",
	address: "",
};

export function CreatePessoaForm() {
	const { data: pessoasResponse } = useGetPessoas(0);
	const { mutateAsync: createPessoa } = useCreatePessoa();
	const { mutateAsync: deletePessoa } = useDeletePessoa();
	const { mutateAsync: updatePessoa } = useUpdatePessoa();

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
		if (formData.id === 0) {
			try {
				await createPessoa(pessoa);
			} catch (_) {
				toast.error("Erro ao criar pessoa");
			}
		} else {
			try {
				await updatePessoa({
					idparam: parsed.id,
					data: pessoa,
				});
			} catch (_) {
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
				className="flex flex-col gap-y-4"
			>
				<form.Field name="name">
					{field => (
						<div>
							<Label htmlFor="name" className="text-xl">
								Nome
							</Label>
							<Input
								id="name"
								type="text"
								value={field.state.value}
								placeholder="Nome"
								onChange={e => {
									field.handleChange(e.target.value);
								}}
							/>
							<FieldInfo fieldMeta={field.state.meta} />
						</div>
					)}
				</form.Field>

				<form.Field name="cpf">
					{field => (
						<div>
							<Label htmlFor="cpf" className="text-xl">
								CPF
							</Label>
							<InputMask
								id="cpf"
								mask="___.___.___-__"
								replacement={{ _: /\d/ }}
								component={Input}
								placeholder="CPF"
								value={field.state.value}
								onChange={e => field.handleChange(e.target.value)}
							/>
							<FieldInfo fieldMeta={field.state.meta} />
						</div>
					)}
				</form.Field>

				<form.Field name="address">
					{field => (
						<div>
							<Label htmlFor="address" className="text-xl">
								Endereço
							</Label>
							<Input
								id="address"
								type="text"
								placeholder="Endereço"
								value={field.state.value}
								onChange={e => field.handleChange(e.target.value)}
							/>
							<FieldInfo fieldMeta={field.state.meta} />
						</div>
					)}
				</form.Field>
				<div className="flex justify-center">
					<Button type="submit">Salvar</Button>
				</div>
			</form>
			<div className="h-[300px] overflow-y-auto">
				<PessoaDataTable
					pessoas={pessoasResponse.pessoas}
					form={form}
					deletePessoa={deletePessoa}
				/>
			</div>
		</div>
	);
}
