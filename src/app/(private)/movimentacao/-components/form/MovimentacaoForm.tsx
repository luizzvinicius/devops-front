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
import { useContaMovimentacoes, useCreateMovimentacao } from "../mutations/useMovimentacaoQuery";
import { Operacao, type OperacaoValue } from "@/models/movimentacao-model";
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
import MovimentacoesTable from "../table/MovimentacaoTable";
import { toast } from "sonner";
import { createMovimentacaoSchema, type CreateMovimentacaoType, nullFormState } from "./formSchema";
import { useDebounce } from "@/hooks/useDebounce";
import {
	useBuscarPessoaEConta,
	usePessoasConta,
} from "@/app/(private)/conta/-components/mutations/useContaQuery";

export function CreateMovimentacao() {
	const [popOverStatus, setPopOverStatus] = useState({
		pessoa: false,
		conta: false,
	});
	const [personId, setPessoaId] = useState<number>(0);
	const [contaId, setContaId] = useState<string>("");
	const [personNameInput, setPersonNameInput] = useState("");
	const personName = useDebounce<string>(personNameInput, 1000);
	const triggerRef = useRef<HTMLButtonElement>(null);
	/*Queries */
	const { data: pessoasConta } = usePessoasConta(personName, 0);
	const { data: pessoaEConta } = useBuscarPessoaEConta(personId);
	const { data: contaMovimentacoes } = useContaMovimentacoes(personId, contaId, 0);
	const { mutateAsync: createMovimentacao } = useCreateMovimentacao(personId);

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
		try {
			await createMovimentacao({
				contaId: formData.conta_id,
				tipoMovimentacao: formData.tipoMovimentacao as OperacaoValue,
				valor: formData.valor,
			});
		} catch {
			toast.error("Erro ao criar movimentação");
		}
		form.setFieldValue("valor", 0);
		form.setFieldValue("tipoMovimentacao", "");
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
							<Popover
								open={popOverStatus.pessoa}
								onOpenChange={status =>
									setPopOverStatus({
										...popOverStatus,
										pessoa: status,
									})
								}
							>
								<PopoverTrigger asChild>
									<Button
										ref={triggerRef}
										variant="outline"
										role="combobox"
										aria-expanded={popOverStatus.pessoa}
										className="w-1/2 justify-between"
									>
										{personId
											? pessoasConta.pessoas.map(pessoa => {
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
											? triggerRef.current.offsetWidth
											: undefined,
									}}
								>
									<Command>
										<CommandInput
											placeholder="Digite o nome da pessoa"
											onValueChange={setPersonNameInput}
										/>
										<CommandList>
											{pessoasConta.pessoas.length === 0 && (
												<CommandEmpty>Pessoa não encontrada</CommandEmpty>
											)}
											<CommandGroup>
												{pessoasConta.pessoas.map(pessoa => (
													<CommandItem
														key={pessoa.id}
														value={pessoa.nome}
														onSelect={() => {
															field.handleChange(pessoa.id);
															setPessoaId(pessoa.id);
															setContaId("");
															setPopOverStatus({
																...popOverStatus,
																pessoa: false,
															});
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
				<form.Field name="conta_id">
					{field => (
						<div>
							<Label htmlFor="conta" className="text-xl">
								Conta
							</Label>
							<Popover
								open={popOverStatus.conta}
								onOpenChange={status =>
									setPopOverStatus({
										...popOverStatus,
										conta: status,
									})
								}
							>
								<PopoverTrigger asChild disabled={personId === 0}>
									<Button
										ref={triggerRef}
										variant="outline"
										role="combobox"
										aria-expanded={popOverStatus.conta}
										className="w-1/2 justify-between"
									>
										{contaId
											? pessoaEConta.pessoaAndContaDtoList.map(pessoa => {
													return pessoa.conta_id === contaId
														? pessoa.conta_id
														: "";
												})
											: "Selecione uma conta"}
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
										<CommandInput placeholder="Digite o id da conta" />
										<CommandList>
											{pessoaEConta.pessoaAndContaDtoList.length === 0 && (
												<CommandEmpty>Conta não encontrada</CommandEmpty>
											)}
											<CommandGroup>
												{pessoaEConta.pessoaAndContaDtoList.map(
													pessoaConta => (
														<CommandItem
															key={pessoaConta.conta_id}
															value={pessoaConta.conta_id}
															onSelect={() => {
																field.handleChange(
																	pessoaConta.conta_id,
																);
																setContaId(pessoaConta.conta_id);
																setPopOverStatus({
																	...popOverStatus,
																	conta: false,
																});
															}}
														>
															{pessoaConta.conta_id}
															<Check
																className={cn(
																	"ml-auto",
																	contaId === pessoaConta.conta_id
																		? "opacity-100"
																		: "opacity-0",
																)}
															/>
														</CommandItem>
													),
												)}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<FieldInfo fieldMeta={field.state.meta} />
						</div>
					)}
				</form.Field>
				<div className="md:flex gap-10">
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
										field.handleChange(value as OperacaoValue);
									}}
									value={field.state.value as OperacaoValue}
								>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Operação" />
									</SelectTrigger>
									<SelectContent>
										{Object.values(Operacao).map(opr => (
											<SelectItem key={opr} value={opr}>
												{opr}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FieldInfo fieldMeta={field.state.meta} />
							</div>
						)}
					</form.Field>
				</div>
				<div className="flex justify-center">
					<Button type="submit">Salvar</Button>
				</div>
			</form>
			<div className="h-[300px] overflow-y-auto">
				<MovimentacoesTable
					form={form}
					movimentacoes={contaMovimentacoes.contaMovimentacoes}
				/>
			</div>
		</div>
	);
}
