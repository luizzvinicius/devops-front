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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InputMask } from "@react-input/mask";
import { zodResolver } from "@hookform/resolvers/zod";
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
			numero: z.string().nonempty("Número da conta é obrigatório"),
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
		numero: "",
		saldo: 0,
	},
	valor: 0,
	tipoMovimentacao: OperacaoEnum.DEPOSITO,
};

export function CreateMovimentacao() {
	const { data: pessoasResponse, isFetching, error } = useGetPessoas(0);

	const { mutateAsync: createMovimentacao } = useCreateMovimentacao();

	const form = useForm<CreateMovimentacaoType>({
		resolver: zodResolver(createMovimentacaoSchema),
		defaultValues: nullFormState,
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
											const selectedPessoa = pessoasResponse.pessoas.find(
												item => String(item.id) === value,
											);
											if (selectedPessoa) {
												field.onChange(selectedPessoa);
												form.setValue("conta", selectedPessoa.conta[0]);
											}
										}}
										value={field.value?.id ? String(field.value.id) : undefined}
									>
										<SelectTrigger className="w-[200px]">
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
								</FormControl>
								<span className="text-sm text-red-500">
									{form.formState?.errors?.pessoa?.message}
								</span>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="conta"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-xl">Conta</FormLabel>
								<FormControl>
									<Select
										onValueChange={value => {
											const selectedConta = pessoasResponse.pessoas.find(
												item => String(item.conta[0].id) === value,
											);
											field.onChange(selectedConta?.conta[0]);
										}}
										value={
											pessoasResponse.pessoas.find(
												pessoa =>
													String(pessoa.conta[0].id) ===
													String(field.value),
											)?.conta
										}
									>
										<SelectTrigger className="w-[200px]">
											<SelectValue placeholder="Selecione uma conta" />
										</SelectTrigger>
										<SelectContent>
											{form.getValues("pessoa")?.id
												? pessoasResponse.pessoas
														.filter(
															item =>
																item.id ===
																form.getValues("pessoa").id,
														)
														.map(item => (
															<SelectItem
																key={item.conta[0].id}
																value={String(item.conta[0].id)}
															>
																{item.conta[0].numero} - Saldo:{" "}
																{item.conta[0].saldo.toLocaleString(
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
								</FormControl>
								<span className="text-sm text-red-500">
									{form.formState?.errors?.conta?.message}
								</span>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="valor"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-xl">Valor</FormLabel>
								<FormControl>
									<InputMask
										className="w-[200px]"
										mask="99999999999999"
										replacement={{ 9: /\d/ }}
										component={Input}
										placeholder="Valor"
										value={field.value === 0 ? "" : field.value} // Mostra vazio se o valor for 0
										onChange={e => {
											const numericValue = e.target.value.replace(/\D/g, "");
											field.onChange(
												numericValue
													? Number.parseInt(numericValue, 10)
													: 0,
											);
										}}
									/>
								</FormControl>
								<span className="text-sm text-red-500">
									{form.formState?.errors?.valor?.message}
								</span>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="operacao"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-xl">Depositar/Retirar</FormLabel>
								<FormControl>
									<Select
										onValueChange={value => {
											field.onChange(value);
										}}
										value={field.value} // Define o valor atual do campo
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
								</FormControl>
								<span className="text-sm text-red-500">
									{form.formState?.errors?.tipoMovimentacao?.message}
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
				{pessoasResponse.pessoas[form.getValues().pessoa.id] === undefined ? (
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
							{pessoasResponse.pessoas[form.getValues().pessoa.id].conta.map(
								(item, index) => (
									<TableRow key={item.id}>
										<TableCell>
											{item.movimentacoes === undefined ||
											item.movimentacoes[0] === undefined
												? "sem transações"
												: item.movimentacoes[0].dataHora}
										</TableCell>
										<TableCell>
											{item.movimentacoes === undefined ||
											item.movimentacoes[0] === undefined
												? "sem transações"
												: item.movimentacoes[0].dataHora}
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
