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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCreateConta } from "./useContaQuery";
import { useDeletePessoa, useGetPessoas } from "@/app/pessoa/-components/usePessoaQuery";

const createContaSchema = z
	.object({
		id: z.number(),
		numeroConta: z.string().nonempty("Número da conta é obrigatório"),
		pessoa: z.object({
			id: z.number(),
			name: z.string().optional(),
			cpf: z.string(),
			address: z.string().optional(),
		}),
	})
	.required();

export type CreateContaType = z.infer<typeof createContaSchema>;

const nullFormState = {
	id: 0,
	numeroConta: "",
	pessoa: {
		id: 0,
		name: "",
		cpf: "",
		address: "",
	},
};

export function CreateConta() {
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const { data: pessoasResponse, isFetching, error } = useGetPessoas(0);

	const { mutateAsync: createConta, isPending: isCreateContaPending } = useCreateConta();
	const { mutateAsync: deletePessoa, isPending: isDeletePessoaPending } = useDeletePessoa();

	const form = useForm<CreateContaType>({
		resolver: zodResolver(createContaSchema),
		defaultValues: nullFormState,
	});

	async function onSubmit(formData: CreateContaType) {
		if (formData.id === 0) {
			await createConta({
				numeroConta: formData.numeroConta,
				pessoaId: formData.pessoa.id,
			});
		}

		form.reset(nullFormState);
	}

	function handleEdit(index: number) {
		const pessoaConta = pessoasResponse.pessoas[index];

		form.reset({
			id: pessoaConta.id,
			numeroConta: pessoaConta.conta[0].numero,
			pessoa: {
				id: pessoaConta.id,
				name: pessoaConta.nome,
				cpf: pessoaConta.cpf,
				address: pessoaConta.endereco,
			},
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
						name="pessoa"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-xl">Pessoa</FormLabel>
								<FormControl>
									<Select
										onValueChange={value => {
											const selectedPessoa = pessoasResponse?.pessoas?.find(
												item => String(item.id) === value,
											);
											field.onChange(selectedPessoa);
										}}
										value={String(field.value.id)}
									>
										<SelectTrigger className="w-[180px]">
											<SelectValue placeholder="Selecione uma pessoa" />
										</SelectTrigger>
										<SelectContent>
											{pessoasResponse?.pessoas?.map(item => (
												<SelectItem key={item.id} value={String(item.id)}>
													{item.nome} - {item.cpf}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormControl>
								<span className="text-sm text-red-500">
									{form.formState?.errors?.pessoa?.message}
								</span>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="numeroConta"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-xl">Número da Conta</FormLabel>
								<FormControl>
									<InputMask
										mask="999999"
										replacement={{ 9: /\d/ }}
										component={Input}
										placeholder="Número da Conta"
										{...field}
									/>
								</FormControl>
								<span className="text-sm text-red-500">
									{form.formState?.errors?.numeroConta?.message}
								</span>
							</FormItem>
						)}
					/>
					<div className="flex justify-center">
						<Button type="submit">salvar</Button>
					</div>
				</form>
			</Form>
			<div className="h-[300px] overflow-y-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nome</TableHead>
							<TableHead>CPF</TableHead>
							<TableHead>Número da conta</TableHead>
							<TableHead>Editar</TableHead>
							<TableHead>Remover</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{pessoasResponse.pessoas.map((item, index) => (
							<TableRow key={item.id}>
								<TableCell>{item.nome}</TableCell>
								<TableCell>{item.cpf}</TableCell>
								<TableCell>
									{(item.conta === undefined || item.conta[0]) === undefined
										? "Sem conta"
										: item.conta[0].numero}
								</TableCell>
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
