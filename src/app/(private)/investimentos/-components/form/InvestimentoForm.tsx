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
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import {
	useBuscarPessoaEConta,
	usePessoasConta,
} from "@/app/(private)/conta/-components/mutations/useContaQuery";
import { nullFormState, createInvestimentoSchema, type CreateInvestimentoType } from "./formSchema";
import { InvestimentoDesc } from "@/models/investimento-model";
import InvestimentoTable from "../table/InvestimentoTable";
import { useCreateInvestimento, useInvestimentos } from "../mutations/useInvestimentosQuery";

export default function InvestimentoForm() {
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
	const { data: contaInvestimentos } = useInvestimentos(contaId);
	const { mutateAsync: createInvestimento } = useCreateInvestimento(contaId);

	const form = useForm({
		defaultValues: nullFormState,
		onSubmit: values => {
			onSubmit(values.value);
		},
		validators: {
			onChange: createInvestimentoSchema,
		},
	});

	async function onSubmit(formData: CreateInvestimentoType) {
		try {
			await createInvestimento({
				idConta: formData.conta_id,
				aporte: formData.aporte,
				tipoInvestimento: formData.investimento_id,
			});
		} catch {
			toast.error("Erro ao criar investimento");
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
				<form.Field name="pessoa_id">
					{field => (
						<div>
							<Label id="pessoa" className="text-xl text-custom">
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
										className="w-1/2 justify-between text-custom"
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
							<Label htmlFor="conta" className="text-xl text-custom">
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
										className="w-1/2 justify-between text-custom"
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
				<form.Field name="investimento_id">
					{field => (
						<div>
							<Label id="movimentacao" className="text-xl text-custom">
								Investimento
							</Label>
							<Select
								onValueChange={value => {
									field.handleChange(+value);
								}}
								value={field.state.value ? String(field.state.value) : undefined}
							>
								<SelectTrigger className="text-custom">
									<SelectValue
										defaultValue=""
										placeholder="Selecione um investimento"
									/>
								</SelectTrigger>
								<SelectContent>
									{Object.entries(InvestimentoDesc).map(([id, desc]) => (
										<SelectItem key={id} value={id}>
											{desc}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldInfo fieldMeta={field.state.meta} />
						</div>
					)}
				</form.Field>
				<form.Field name="aporte">
					{field => (
						<div>
							<Label htmlFor="valor" className="text-xl text-custom">
								Aporte
							</Label>
							<InputMask
								id="valor"
								className="w-[200px] placeholder-[#f7f9fb] text-custom"
								mask="99999999999999"
								replacement={{ 9: /\d/ }}
								component={Input}
								placeholder="Quanto deseja investir?"
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
				<div className="flex justify-center">
					<Button type="submit" className="bg-background-tertiary text-custom">
						Investir
					</Button>
				</div>
			</form>
			<div className="h-[300px] overflow-y-auto">
				<InvestimentoTable
					investimentos={
						contaInvestimentos
							? contaInvestimentos.map(inv => ({
									...inv,
									tipoInvestimento: String(inv.tipoInvestimento),
								}))
							: []
					}
				/>
			</div>
		</div>
	);
}
