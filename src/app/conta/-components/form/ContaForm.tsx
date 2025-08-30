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
import { useRef, useState } from "react";
import {
	useBuscarPessoaEConta,
	useCreateConta,
	useDeleteConta,
	usePessoasConta,
} from "../mutations/useContaQuery";
import { useForm } from "@tanstack/react-form";
import { FieldInfo } from "@/components/forms/FieldInfo";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { showCpfFormatted } from "@/utils/util";
import ContasTable from "../table/ContasTable";
import { createContaSchema, nullFormState } from "./formSchema";
import type { z } from "zod";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

export function CreateConta() {
	const [open, setOpen] = useState(false);
	const [personNameInput, setPersonNameInput] = useState("");
	const personName = useDebounce<string>(personNameInput, 1000);
	const [personId, setPersonId] = useState<number>(0);
	const triggerRef = useRef<HTMLButtonElement>(null);

	/*Queries */
	const { data: pessoasContas } = usePessoasConta(personName, 0);
	const { mutateAsync: createConta } = useCreateConta(personName);
	const { data: pessoaEConta } = useBuscarPessoaEConta(personId);
	const { mutateAsync: deleteConta } = useDeleteConta(personId);

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
		try {
			await createConta({
				pessoaId: formData.id,
			});
		} catch (_) {
			toast.error("Erro ao criar conta");
		}
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
										{personId
											? pessoasContas?.pessoas.map(pessoa => {
													if (pessoa.id === personId)
														return `${pessoa.nome} - ${showCpfFormatted(pessoa.cpf)}`;
												})
											: "Selecione uma pessoa"}
										<ChevronsUpDown className="opacity-50" />
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="p-1"
									style={{
										width: triggerRef.current
											? triggerRef?.current?.offsetWidth
											: undefined,
									}}
								>
									<Command>
										<CommandInput
											placeholder="Digite o nome da pessoa"
											onValueChange={search => {
												setPersonNameInput(search);
											}}
										/>
										<CommandList>
											{pessoasContas?.pessoas.length === 0 && (
												<CommandEmpty>Pessoa não encontrada</CommandEmpty>
											)}
											<CommandGroup>
												{pessoasContas?.pessoas.map(pessoa => (
													<CommandItem
														key={pessoa.id}
														value={pessoa.nome}
														onSelect={_ => {
															field.handleChange(pessoa.id);
															setPersonId(pessoa.id);
															setOpen(false);
														}}
													>
														{`Nome: ${pessoa.nome} | CPF: ${showCpfFormatted(pessoa.cpf)}`}
														<Check
															className={cn(
																"ml-auto",
																personId === pessoa.id
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
