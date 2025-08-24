"use client";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useRef, useState } from "react";
import {
	useBuscarPessoaEConta,
	useCreateConta,
	useDeleteConta,
	usePessoasConta,
} from "./useContaQuery";
import { useForm } from "@tanstack/react-form";
import { FieldInfo } from "@/components/forms/FieldInfo";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { showCpfFormatted } from "@/utils/util";
import { z } from "zod";
import ContasTable from "./table/ContasTable";
import type { PessoaPageDto } from "@/models/pessoa-model";

const createContaSchema = z
	.object({
		id: z.number().positive("Nenhuma pessoa selecionada"),
	})
	.required();

const nullFormState = {
	id: 0,
};
export function CreateConta() {
	const [searchTerm, setSearchTerm] = useState("");
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState<string | undefined>("");
	const triggerRef = useRef<HTMLButtonElement>(null);
	const [filteredPessoa, setFilteredPessoa] = useState<PessoaPageDto>();

	/*Queries */
	const pessoasContas = usePessoasConta(searchTerm, 0);
	const { mutateAsync: createConta } = useCreateConta();
	const { data: pessoaEConta, refetch: updateBuscarPessoaEConta } = useBuscarPessoaEConta(
		Number(value),
	);
	const { mutateAsync: deleteConta } = useDeleteConta();

	useEffect(() => {
		const handler = setTimeout(async () => {
			if (searchTerm.length > 0) {
				try {
					const result = pessoasContas.data;
					setFilteredPessoa(result);
					await updateBuscarPessoaEConta();
				} catch (_) {
					setFilteredPessoa(undefined);
				}
			} else {
				setFilteredPessoa(undefined);
			}
		}, 1000);
		return () => clearTimeout(handler);
	}, [searchTerm, updateBuscarPessoaEConta, pessoasContas]);

	const form = useForm({
		defaultValues: nullFormState,
		onSubmit: values => {
			onSubmit(values.value);
		},
		validators: {
			onChange: createContaSchema,
		},
	});

	async function onSubmit(formData: z.infer<typeof createContaSchema>) {
		await createConta({
			pessoaId: formData.id,
		});
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
				<form.Field name="id">
					{field => (
						<div>
							<Label id="pessoa" className="text-xl">
								Pessoa
							</Label>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										ref={triggerRef}
										variant="outline"
										role="combobox"
										aria-expanded={open}
										className="w-1/2 justify-between"
									>
										{value
											? filteredPessoa?.pessoas.map(pessoa => {
													return pessoa.id === Number(value)
														? `${pessoa.nome} - ${showCpfFormatted(pessoa.cpf)}`
														: "";
												})
											: "Selecione uma pessoa"}
										<ChevronsUpDown className="opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="p-1"
									style={{
										width: triggerRef.current
											? triggerRef.current.offsetWidth
											: undefined,
									}}
								>
									<Command>
										<CommandInput
											placeholder="Digite o nome da pessoa"
											onValueChange={setSearchTerm}
										/>
										<CommandList>
											{filteredPessoa?.pessoas.length === 0 && (
												<CommandEmpty>Pessoa não encontrada</CommandEmpty>
											)}
											<CommandGroup>
												{filteredPessoa?.pessoas.map(pessoa => (
													<CommandItem
														key={pessoa.id}
														value={pessoa.nome}
														onSelect={_ => {
															field.handleChange(pessoa.id);
															setValue(String(pessoa.id));
															setOpen(false);
														}}
													>
														{`Nome: ${pessoa.nome} | CPF: ${showCpfFormatted(pessoa.cpf)}`}
														<Check
															className={cn(
																"ml-auto",
																Number(value) === pessoa.id
																	? "opacity-100"
																	: "opacity-0",
															)}
														/>
													</CommandItem>
												))}
											</CommandGroup>
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
				<ContasTable
					pessoaConta={pessoaEConta.pessoaAndContaDtoList}
					form={form}
					deleteConta={deleteConta}
				/>
			</div>
		</div>
	);
}
