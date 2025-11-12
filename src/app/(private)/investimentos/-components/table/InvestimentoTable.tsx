import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { generateChartPrevision, showDateFormatted } from "@/utils/util";
import { Button } from "@/components/ui/button";
import type { InvestimentoRow } from "@/models/investimento-model";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
export const description = "A simple area chart";
import { InputMask } from "@react-input/mask";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { FieldInfo } from "@/components/forms/FieldInfo";
import { Input } from "@/components/ui/input";
import z from "zod";
import { saqueInvestimento } from "@/api/investimentos";

type InvestimentosColumns = InvestimentoRow;

export const investimentoModalSchema = z
	.object({
		valor: z.number(),
	})
	.required();

export const columns = (
	openDialogId: number | null,
	setOpenDialogId: (id: number | null) => void,
): ColumnDef<InvestimentosColumns>[] => [
	{
		accessorKey: "contaId",
		header: "Conta",
		cell: ({ row }) => {
			return <div>{row.original.idConta}</div>;
		},
	},
	{
		accessorKey: "tipoInvestimento",
		header: "Tipo investimento",
		cell: ({ row }) => {
			return <div>{row.original.tipoInvestimento}</div>;
		},
	},
	{
		accessorKey: "totalInvestido",
		header: "Total investido",
		cell: ({ row }) => {
			const valor = row.original.totalInvestido;
			return (
				<div>{valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
			);
		},
	},
	{
		accessorKey: "resgate",
		header: "Data de resgate",
		cell: ({ row }) => {
			const data = new Date(row.original.resgate);
			return <div>{showDateFormatted(data)}</div>;
		},
	},
	{
		header: "Detalhes",
		cell: ({ row }) => {
			const idInvestimento = row.original.idInvestimento;
			const form = useForm({
				defaultValues: {
					valor: 0,
				},
				onSubmit: values => {
					onSubmit(values.value);
				},
				validators: {
					onChange: investimentoModalSchema,
				},
			});
			async function onSubmit(formData: z.infer<typeof investimentoModalSchema>) {
				try {
					await saqueInvestimento(idInvestimento, formData.valor);
					toast.success("Saque realizado");
				} catch {
					toast.error("Erro ao sacar investimento");
				}
			}
			const chartData = generateChartPrevision(
				row.original.resgate,
				row.original.totalInvestido,
				row.original.taxa,
			);

			const chartConfig = {
				montante: {
					label: "montante",
					color: "green",
				},
			} satisfies ChartConfig;
			return (
				<Dialog
					open={openDialogId === idInvestimento}
					onOpenChange={open => setOpenDialogId(open ? idInvestimento : null)}
				>
					<DialogTrigger asChild>
						<Button className="bg-background-tertiary" size="sm">
							Mais detalhes
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle className="text-custom text-center">
								Gráfico previsão do investimento
							</DialogTitle>
							<Card>
								<CardHeader>
									<CardTitle>{row.original.tipoInvestimento}</CardTitle>
								</CardHeader>
								<CardContent>
									<ChartContainer config={chartConfig}>
										<AreaChart
											accessibilityLayer
											data={chartData}
											margin={{
												left: 12,
												right: 12,
											}}
										>
											<CartesianGrid vertical={false} />
											<XAxis
												dataKey="month"
												tickLine={false}
												axisLine={false}
												tickMargin={8}
												tickFormatter={value => value.slice(0, 3)}
											/>
											<ChartTooltip
												cursor={false}
												contentStyle={{ backgroundColor: "#fff" }}
												content={
													<ChartTooltipContent
														indicator="line"
														className="text-white"
													/>
												}
											/>
											<Area
												dataKey="montante"
												type="natural"
												fill="var(--color-montante)"
												fillOpacity={0.4}
												stroke="var(--color-montante)"
											/>
										</AreaChart>
									</ChartContainer>
								</CardContent>
							</Card>
							<DialogDescription className="text-base text-custom">
								Total investido{" "}
								{row.original.totalInvestido.toLocaleString("pt-BR", {
									style: "currency",
									currency: "BRL",
								})}
							</DialogDescription>
							<div className="flex flex-col items-center">
								<form
									className="flex flex-col justify-center"
									onSubmit={e => {
										e.preventDefault();
										e.stopPropagation();
										form.handleSubmit();
									}}
								>
									<form.Field name="valor">
										{field => (
											<>
												<InputMask
													id="valor"
													className="w-[300px] placeholder-[#f7f9fb] text-custom mb-2"
													mask="___________"
													replacement={{ _: /\d/ }}
													component={Input}
													placeholder="Digite a quantia para resgatar"
													value={
														field.state.value === 0
															? ""
															: field.state.value
													}
													onChange={e => {
														const numericValue = e.target.value.replace(
															/\D/g,
															"",
														);
														field.handleChange(
															numericValue
																? Number.parseInt(numericValue, 10)
																: 0,
														);
													}}
												/>
												<FieldInfo fieldMeta={field.state.meta} />
											</>
										)}
									</form.Field>
									<Button
										className="bg-background-secondary"
										disabled={
											row.original.tipoInvestimento !== "Renda fixa 10%"
										}
									>
										resgatar
									</Button>
								</form>
							</div>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			);
		},
	},
];

export default function investimentoTable({ investimentos }: { investimentos: InvestimentoRow[] }) {
	const [openDialogId, setOpenDialogId] = useState<number | null>(null);

	const data = investimentos[0].idConta === "" ? [] : investimentos;
	return (
		<DataTable columns={columns(openDialogId, setOpenDialogId)} data={data} searchFields={[]} />
	);
}
