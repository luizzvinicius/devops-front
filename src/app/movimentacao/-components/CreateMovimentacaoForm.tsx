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
import {
	useContaMovimentacoes,
	useCreateMovimentacao,
	useDeleteMovimentacao,
} from "./useMovimentacaoQuery";
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
import { useEffect, useRef, useState } from "react";
import { useBuscarPessoaEConta, usePessoasConta } from "@/app/conta/-components/useContaQuery";
import MovimentacoesTable from "./table/MovimentacaoTable";
import { toast } from "sonner";
import { z } from "zod";

const createMovimentacaoSchema = z
	.object({
		pessoa_id: z.number(),
		conta_id: z.string(),
		valor: z.number().positive("Valor deve ser maior que 0"),
		tipoMovimentacao: z
			.enum(Object.values(Operacao) as [OperacaoValue])
			.or(z.string().nonempty()),
	})
	.required();

export type CreateMovimentacaoType = z.infer<typeof createMovimentacaoSchema>;

const nullFormState: CreateMovimentacaoType = {
	pessoa_id: 0,
	conta_id: "",
	valor: 0,
	tipoMovimentacao: "",
};

export function CreateMovimentacao() {
	const [openPessoaPopOver, setOpenPessoaPopOver] = useState<boolean>(false);
	const [openContaPopOver, setOpenContaPopOver] = useState<boolean>(false);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [pessoaId, setPessoaId] = useState<string | undefined>("");
	const [contaId, setContaId] = useState<string>("");
	const [searchTerm, setSearchTerm] = useState("");
	const triggerRef = useRef<HTMLButtonElement>(null);

	/*Queries */
	const pessoasConta = usePessoasConta(searchTerm, 0);
	const { data: pessoaEConta, refetch: updateBuscarPessoaEConta } = useBuscarPessoaEConta(
		Number(pessoaId),
	);
	const contaMovimentacoes = useContaMovimentacoes(contaId, 0);
	const { mutateAsync: createMovimentacao } = useCreateMovimentacao();
	const { mutateAsync: deleteMovimentacao } = useDeleteMovimentacao();

	useEffect(() => {
		const handler = setTimeout(async () => {
			if (searchTerm.length > 0) {
				try {
					await updateBuscarPessoaEConta();
				} catch (_) {}
			}
		}, 1000);
		return () => clearTimeout(handler);
	}, [searchTerm, updateBuscarPessoaEConta]);

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
		console.log(formData);
		try {
			await createMovimentacao({
				contaId: formData.conta_id,
				tipoMovimentacao: formData.tipoMovimentacao as OperacaoValue,
				valor: formData.valor,
			});
		} catch (_) {
			toast.error("Erro ao criar movimentação");
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
				<form.Field name="pessoa_id">
					{field => (
						<div>
							<Label id="pessoa" className="text-xl">
								Pessoa
							</Label>
							<Popover open={openPessoaPopOver} onOpenChange={setOpenPessoaPopOver}>
								<PopoverTrigger asChild>
									<Button
										ref={triggerRef}
										variant="outline"
										role="combobox"
										aria-expanded={openPessoaPopOver}
										className="w-1/2 justify-between"
									>
										{pessoaId
											? pessoasConta.data?.pessoas.map(pessoa => {
													return pessoa.id === Number(pessoaId)
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
															setPessoaId(String(pessoa.id));
															setOpenPessoaPopOver(false);
														}}
													>
														{`Nome: ${pessoa.nome} | CPF: ${showCpfFormatted(pessoa.cpf)}`}
														<Check
															className={cn(
																"ml-auto",
																Number(pessoaId) === pessoa.id
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
							<Popover open={openContaPopOver} onOpenChange={setOpenContaPopOver}>
								<PopoverTrigger asChild>
									<Button
										ref={triggerRef}
										variant="outline"
										role="combobox"
										aria-expanded={openContaPopOver}
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
										<CommandInput
											placeholder="Digite o id da conta"
											onValueChange={setSearchTerm}
										/>
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
															onSelect={_ => {
																field.handleChange(
																	pessoaConta.conta_id,
																);
																setContaId(pessoaConta.conta_id);
																setOpenContaPopOver(false);
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
				<div className="flex justify-center">
					<Button type="submit">Salvar</Button>
				</div>
			</form>
			<div className="h-[300px] overflow-y-auto">
				<MovimentacoesTable
					form={form}
					deleteMovimentacao={deleteMovimentacao}
					movimentacoes={contaMovimentacoes.data.contaMovimentacoes}
					isDialogOpen={isDialogOpen}
					setIsDialogOpen={setIsDialogOpen}
				/>
			</div>
		</div>
	);
}
