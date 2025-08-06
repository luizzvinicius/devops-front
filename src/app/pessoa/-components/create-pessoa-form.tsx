"use client";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InputMask } from "@react-input/mask";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useCreatePessoa, useDeletePessoa, useGetPessoas, useUpdatePessoa } from "./usePessoaQuery";
import type { PessoaResponseDto } from "@/api/pessoas";

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

	const form = useForm<CreatePessoaType>({
		resolver: zodResolver(createPessoaSchema),
		defaultValues: nullFormState,
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
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-xl">Nome</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="Nome"
										{...field}
										className={
											form.formState.errors.name ? "border-red-500" : ""
										}
									/>
								</FormControl>
								<span className="text-sm text-red-500">
									{form.formState?.errors?.name?.message}
								</span>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="cpf"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-xl">CPF</FormLabel>
								<FormControl>
									<InputMask
										mask="___.___.___-__"
										replacement={{ _: /\d/ }}
										component={Input}
										id="cpf"
										placeholder="CPF"
										{...field}
									/>
								</FormControl>
								<span className="text-sm text-red-500">
									{form.formState?.errors?.cpf?.message}
								</span>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="address"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-xl">Endereço</FormLabel>
								<FormControl>
									<Input type="text" placeholder="Endereço" {...field} />
								</FormControl>
								<span className="text-sm text-red-500">
									{form.formState?.errors?.address?.message}
								</span>
							</FormItem>
						)}
					/>
					<div className="flex justify-center">
						<Button type="submit">Salvar</Button>
					</div>
				</form>
			</Form>
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
