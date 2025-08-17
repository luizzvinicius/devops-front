"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { InputMask } from "@react-input/mask";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useCreatePessoa, useDeletePessoa, useGetPessoas, useUpdatePessoa } from "./usePessoaQuery";
import type { PessoaResponseDto } from "@/models/pessoa-model";
import { Label } from "@/components/ui/label";
import { FieldInfo } from "@/components/forms/FieldInfo";

export const createPessoaSchema = z
	.object({
		id: z.number(),
		name: z
			.string()
			.min(3, "Nome mínimo de 3 caracteres")
			.max(255, "Nome deve ter no máximo 255 caracteres"),
		cpf: z
			.string()
			.min(11, "O CPF deve ter pelo menos 11 caracteres")
			.trim()
			.transform(cpf => cpf.replaceAll(".", "").replace("-", "")),
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
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	const { data: pessoasResponse } = useGetPessoas(0);
	const { mutateAsync: createPessoa } = useCreatePessoa();
	const { mutateAsync: deletePessoa } = useDeletePessoa();
	const { mutateAsync: updatePessoa } = useUpdatePessoa();

	const form = useForm({
		defaultValues: nullFormState,
		onSubmit: values => {
			console.log(values.value);
		},
		validators: {
			onChange: createPessoaSchema,
		},
	});

	async function onSubmit(formData: CreatePessoaType) {
		if (formData.id === 0) {
			await createPessoa({
				nome: formData.name,
				cpf: formData.cpf,
				endereco: formData.address,
			});
		} else {
			await updatePessoa({
				idparam: formData.id,
				data: {
					nome: formData.name,
					cpf: formData.cpf,
					endereco: formData.address,
				},
			});
		}

		form.reset(nullFormState);
	}

	function handleEdit(index: number) {
		const pessoa = pessoasResponse.pessoas[index];

		form.reset({
			id: pessoa.id,
			name: pessoa.nome,
			cpf: pessoa.cpf,
			address: pessoa.endereco,
		});
	}

	async function handleRemove(index: number) {
		await deletePessoa(pessoasResponse.pessoas[index].id);
		setIsDialogOpen(false);
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
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nome</TableHead>
							<TableHead>CPF</TableHead>
							<TableHead>Endereço</TableHead>
							<TableHead>Editar</TableHead>
							<TableHead>Remover</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{pessoasResponse?.pessoas.map((item: PessoaResponseDto, index) => (
							<TableRow key={item.id}>
								<TableCell>{item.nome}</TableCell>
								<TableCell>{item.cpf}</TableCell>
								<TableCell>{item.endereco}</TableCell>
								<TableCell className="text-center p-0">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEdit(index)}
									>
										Editar
									</Button>
								</TableCell>
								<TableCell className="text-center p-0">
									<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
										<DialogTrigger asChild>
											<Button variant="destructive" size="sm">
												Remover
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Confirmar Remoção</DialogTitle>
											</DialogHeader>
											<p>Tem certeza que deseja remover este item?</p>
											<DialogFooter>
												<Button
													variant="outline"
													onClick={() => setIsDialogOpen(false)}
												>
													Cancelar
												</Button>
												<Button
													variant="destructive"
													onClick={() => handleRemove(index)}
												>
													Remover
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
