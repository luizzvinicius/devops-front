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
import { InputMask } from "@react-input/mask";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useGetPessoas } from "@/app/pessoa/-components/usePessoaQuery";
import { useCreateMovimentacao } from "./useMovimentacaoQuery";
import { OperacaoEnum } from "@/models/movimentacao-model";
import { useForm } from "@tanstack/react-form";
import { FieldInfo } from "@/components/forms/FieldInfo";
import { Label } from "@/components/ui/label";
import { z } from "zod";

export const OperacaoEnumSchema = z.enum(
	Object.values(OperacaoEnum) as [OperacaoEnum, ...OperacaoEnum[]],
);

const createMovimentacaoSchema = z
	.object({
		pessoa: z.object({
			id: z.number(),
			name: z.string().optional(),
			cpf: z.string(),
			address: z.string().optional(),
		}),
		conta: z.object({
			id: z.number(),
			saldo: z
				.number()
				.min(-1, "Saldo deve ser maior ou igual a zero")
				.transform(val => Number(val)),
		}),
		valor: z.number(),
		tipoMovimentacao: OperacaoEnumSchema,
	})
	.required();

export type CreateMovimentacaoType = z.infer<typeof createMovimentacaoSchema>;

const nullFormState = {
	pessoa: {
		id: 0,
		name: "",
		cpf: "",
		address: "",
	},
	conta: {
		id: 0,
		saldo: 0,
	},
	valor: 0,
	tipoMovimentacao: OperacaoEnum.DEPOSITO,
};

export function CreateMovimentacao() {
	const { data: pessoasResponse, isFetching, error } = useGetPessoas(0);

	const { mutateAsync: createMovimentacao } = useCreateMovimentacao();

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
			contaId: formData.conta.id,
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
				<form.Field name="pessoa">
					{field => (
						<div>
							<Label id="pessoa" className="text-xl">
								Pessoa
							</Label>
							<Select
								onValueChange={value => {
									const selectedPessoa = pessoasResponse.pessoas.find(
										item => String(item.id) === value,
									);
									if (selectedPessoa) {
										onChange(selectedPessoa);
										form.setValue("conta", selectedPessoa.contas[0]);
									}
								}}
								value={
									field.state.value.id ? String(field.state.value.id) : undefined
								}
							>
								<SelectTrigger id="pessoa" className="w-[200px]">
									<SelectValue placeholder="Selecione uma pessoa" />
								</SelectTrigger>
								<SelectContent>
									{pessoasResponse.pessoas.map(item => (
										<SelectItem key={item.id} value={String(item.id)}>
											{item.nome} - {item.cpf}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldInfo fieldMeta={field.state.meta} />
						</div>
					)}
				</form.Field>
				<form.Field name="conta">
					{field => (
						<div>
							<Label htmlFor="conta" className="text-xl">
								Conta
							</Label>
							<Select
								onValueChange={value => {
									const selectedConta = pessoasResponse.pessoas.find(
										item => String(item.contas[0].id) === value,
									);
									field.onChange(selectedConta?.contas[0]);
								}}
								value={
									pessoasResponse.pessoas.find(
										pessoa =>
											String(pessoa.contas[0].id) ===
											String(field.state.value),
									)?.contas
								}
							>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="Selecione uma conta" />
								</SelectTrigger>
								<SelectContent id="conta">
									{form.state.values.pessoa.id
										? pessoasResponse.pessoas
												.filter(
													item => item.id === form.state.values.pessoa.id,
												)
												.map(item => (
													<SelectItem
														key={item.contas[0].id}
														value={String(item.contas[0].id)}
													>
														{item.contas[0].id} - Saldo:{" "}
														{item.contas[0].saldo.toLocaleString(
															"pt-BR",
															{
																style: "currency",
																currency: "BRL",
															},
														)}
													</SelectItem>
												))
										: null}
								</SelectContent>
							</Select>
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
									field.onChange(
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
								Movimentacao
							</Label>
							<Select
								onValueChange={value => {
									field.onChange(value);
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
				{pessoasResponse.pessoas[form.state.values.pessoa.id] === undefined ? (
					"sem transações"
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Data</TableHead>
								<TableHead>Valor</TableHead>
							</TableRow>
						</TableHeader>

						{/* {pessoasResponse.pessoas[0].conta[0].movimentacoes[0].dataHora === undefined
						? "Sem transação"
						: ""} */}
						<TableBody>
							{pessoasResponse.pessoas[form.state.values.pessoa.id].contas.map(
								(item, index) => (
									<TableRow key={item.id}>
										<TableCell>
											{item.movimentacoes === undefined ||
											item.movimentacoes[0] === undefined
												? "sem transações"
												: item.movimentacoes[0].data.toString()}
										</TableCell>
										<TableCell>
											{item.movimentacoes === undefined ||
											item.movimentacoes[0] === undefined
												? "sem transações"
												: item.movimentacoes[0].data.toString()}
										</TableCell>
									</TableRow>
								),
							)}
						</TableBody>
					</Table>
				)}

				{/* <p>Saldo: {item.conta[0].movimentacoes[0].valor}</p> */}
			</div>
		</div>
	);
}
