"use client";
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
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useState } from "react";
import { useCreateConta } from "./useContaQuery";
import { useDeletePessoa, useGetPessoas } from "@/app/pessoa/-components/usePessoaQuery";
import { useForm } from "@tanstack/react-form";
import { FieldInfo } from "@/components/forms/FieldInfo";
import { Label } from "@/components/ui/label";
import type { PessoaPageDto, PessoaResponseDto } from "@/models/pessoa-model";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { showCpfFormatted } from "@/utils/util";

const createContaSchema = z
	.object({
		// id: z.number(),
		// pessoa: z.object({}),
		id: z.number(),
		nome: z.string(),
		cpf: z.string(),
		endereco: z.string(),
	})
	.required();

export type CreateContaType = z.infer<typeof createContaSchema>;

const nullFormState = {
	// id: 0,
	// pessoa: {
	// },
	id: 0,
	nome: "",
	cpf: "",
	endereco: "",
};

const pessoa: PessoaResponseDto = {
	id: 1,
	nome: "Luiz",
	cpf: "11111111111",
	endereco: "rua tal",
	contas: [
		{
			id: 1,
			movimentacoes: [
				{
					data: new Date(),
					id: 4,
					valor: 50,
				},
			],
			saldo: 50,
		},
	],
};
const pessoa_mock: PessoaPageDto = {
	pessoas: [pessoa],
	pageSize: 1,
	totalPages: 1,
};

export function CreateConta() {
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const { data: pessoasResponse, isFetching, error } = useGetPessoas(0);

	const { mutateAsync: createConta, isPending: isCreateContaPending } = useCreateConta();
	const { mutateAsync: deletePessoa, isPending: isDeletePessoaPending } = useDeletePessoa();

	const form = useForm({
		defaultValues: nullFormState,
		onSubmit: values => {
			onSubmit(values.value);
		},
		validators: {
			onChange: createContaSchema,
		},
	});

	async function onSubmit(formData: CreateContaType) {
		// if (formData.id === 0) {
		await createConta({
			pessoaId: formData.id,
		});
		// }

		form.reset(nullFormState);
	}

	function handleEdit(index: number) {
		const pessoaConta = pessoa_mock.pessoas[index];

		form.reset({
			// id: pessoaConta.id,
			// pessoa: {
			id: pessoaConta.id,
			nome: pessoaConta.nome,
			cpf: pessoaConta.cpf,
			endereco: pessoaConta.endereco,
			// },
		});
	}

	async function handleRemove(index: number) {
		await deletePessoa(pessoa_mock.pessoas[index].id);
		setIsDialogOpen(false);
	}
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState<PessoaResponseDto>();

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
				<form.Field name="id">
					{field => (
						<div>
							<Label id="pessoa" className="text-xl">
								Pessoa
							</Label>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										aria-expanded={open}
										className="w-1/2 justify-between"
									>
										{value
											? pessoa_mock.pessoas.find(
													pessoa => pessoa.id === value.id,
												)?.nome
											: "Selecione uma pessoa"}
										<ChevronsUpDown className="opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0">
									<Command>
										<CommandInput placeholder="Nome" className="h-9" />
										<CommandList>
											<CommandGroup>
												{pessoa_mock.pessoas.map(pessoa => (
													<CommandItem
														key={pessoa.id}
														value={String(pessoa.id)}
														onSelect={currentValue => {
															setValue(
																pessoa_mock.pessoas.find(
																	pessoa =>
																		String(pessoa.id) ===
																		currentValue,
																),
															);
															setOpen(false);
														}}
													>
														Nome: {pessoa.nome} CPF:
														{showCpfFormatted(pessoa.cpf)}
														<Check
															className={cn(
																"ml-auto",
																value?.id === pessoa.id
																	? "opacity-100"
																	: "opacity-0",
															)}
														/>
													</CommandItem>
												))}
											</CommandGroup>
											<CommandEmpty>Não encontrado</CommandEmpty>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<FieldInfo fieldMeta={field.state.meta} />
						</div>
					)}
				</form.Field>
				<div className="flex justify-center">
					<Button type="submit">Criar conta</Button>
				</div>
			</form>
			<div className="h-[300px] overflow-y-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nome</TableHead>
							<TableHead>CPF</TableHead>
							<TableHead>Número da conta</TableHead>
							<TableHead>Remover</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{pessoa_mock.pessoas.map((pessoa, index) => (
							<TableRow key={pessoa.id}>
								<TableCell>{pessoa.nome}</TableCell>
								<TableCell>{pessoa.cpf}</TableCell>
								<TableCell>
									{(pessoa.contas === undefined || pessoa.contas[0]) === undefined
										? "Sem conta"
										: pessoa.contas[0].id}
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
