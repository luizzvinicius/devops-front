"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { InputMask } from "@react-input/mask";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useDeleteMovimentacao } from "./useMovimentacaoQuery";
import { OperacaoEnum } from "@/models/movimentacao-model";
import { useForm } from "@tanstack/react-form";
import { FieldInfo } from "@/components/forms/FieldInfo";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { showCpfFormatted } from "@/utils/util";
import { useRef, useState } from "react";
import { usePessoasConta } from "@/app/conta/-components/useContaQuery";
import MovimentacoesTable from "./table/MovimentacaoTable";
import { z } from "zod";
import { createMovimentacao } from "@/api/movimentacoes";

export const OperacaoEnumSchema = z.enum(
	Object.values(OperacaoEnum) as [OperacaoEnum, ...OperacaoEnum[]],
);

const createMovimentacaoSchema = z
	.object({
		pessoa_id: z.number(),
		conta_id: z.string(),
		valor: z.number().positive(),
		tipoMovimentacao: OperacaoEnumSchema,
	})
	.required();

export type CreateMovimentacaoType = z.infer<typeof createMovimentacaoSchema>;

const nullFormState = {
	pessoa_id: 0,
	conta_id: "",
	valor: 0,
	tipoMovimentacao: OperacaoEnum.DEPOSITO,
};

export function CreateMovimentacao() {
	const [open, setOpen] = useState<boolean>(false);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [value, setValue] = useState<string | undefined>("");
	const [searchTerm, setSearchTerm] = useState("");
	const [queryEnabled, setQueryEnabled] = useState(false);

	const triggerRef = useRef<HTMLButtonElement>(null);

	/*Queries */
	const pessoasConta = usePessoasConta(searchTerm, 0, queryEnabled);
	// const { mutateAsync: createMovimentacao } = useCreateMovimentacao();
	const deleteMovimentacao = useDeleteMovimentacao();

	const form = useForm({
		defaultValues: nullFormState,
		onSubmit: values => {
			onSubmit(values.value);
		},
		validators: {
			onChange: createMovimentacaoSchema,
		},
	});

	async function onSubmit(formData: CreateMovimentacaoType) {
		await createMovimentacao({
			contaId: formData.conta_id,
			tipoMovimentacao: formData.tipoMovimentacao.toString(),
			valor: formData.valor,
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
				<form.Field name="pessoa_id">
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
											? pessoasConta.data?.pessoas.map(pessoa => {
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
											{pessoasConta.data.pessoas.length === 0 && (
												<CommandEmpty>Pessoa não encontrada</CommandEmpty>
											)}
											<CommandGroup>
												{pessoasConta.data?.pessoas.map(pessoa => (
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
				<form.Field name="conta_id">
					{field => (
						<div>
							<Label htmlFor="conta" className="text-xl">
								Conta
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
											? pessoasConta.data?.pessoas.map(pessoa => {
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
											{pessoasConta.data.pessoas.length === 0 && (
												<CommandEmpty>Pessoa não encontrada</CommandEmpty>
											)}
											<CommandGroup>
												{pessoasConta.data?.pessoas.map(pessoa => (
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
				<form.Field name="valor">
					{field => (
						<div>
							<Label htmlFor="valor" className="text-xl">
								Valor
							</Label>
							<InputMask
								id="valor"
								className="w-[200px]"
								mask="99999999999999"
								replacement={{ 9: /\d/ }}
								component={Input}
								placeholder="Valor"
								value={field.state.value === 0 ? "" : field.state.value}
								onChange={e => {
									const numericValue = e.target.value.replace(/\D/g, "");
									field.handleChange(
										numericValue ? Number.parseInt(numericValue, 10) : 0,
									);
								}}
							/>
							<FieldInfo fieldMeta={field.state.meta} />
						</div>
					)}
				</form.Field>
				<form.Field name="tipoMovimentacao">
					{field => (
						<div>
							<Label id="movimentacao" className="text-xl">
								Movimentação
							</Label>
							<Select
								onValueChange={value => {
									field.handleChange(value);
								}}
								value={field.state.value}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Operação" />
								</SelectTrigger>
								<SelectContent>
									{Object.values(OperacaoEnum).map(opr => (
										<SelectItem key={opr} value={opr.toString()}>
											{opr.toLowerCase()}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldInfo fieldMeta={field.state.meta} />
						</div>
					)}
				</form.Field>
				<div className="flex justify-center">
					<Button type="submit">Salvar</Button>
				</div>
			</form>
			<div className="h-[300px] overflow-y-auto">
				<MovimentacoesTable
					form={form}
					deleteMovimentacao={deleteMovimentacao}
					movimentacoes={[]}
					isDialogOpen={isDialogOpen}
					setIsDialogOpen={setIsDialogOpen}
				/>
			</div>
		</div>
	);
}
