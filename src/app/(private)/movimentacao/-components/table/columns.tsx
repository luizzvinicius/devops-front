"use client";
import type { AnyFormApi } from "@tanstack/react-form";
import type { ColumnDef } from "@tanstack/react-table";
import { showDateFormatted } from "@/utils/util";
import type { ContaMovimentacoesDto } from "@/models/conta-model";
import type { DataTableFeatures } from "./data-table-features";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

type MovimentacoesColumns = ContaMovimentacoesDto & {
    form: AnyFormApi;
};

export const columns: ColumnDef<DataTableFeatures, MovimentacoesColumns>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                data-indeterminate={
                    table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
                }
                onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={value => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "contaId",
        header: "Conta",
        cell: ({ row }) => {
            return <div>{row.original.contaId}</div>;
        },
    },
    {
        accessorKey: "movimentacaoId",
        header: "Id movimentação",
        cell: ({ row }) => {
            return <div>{row.original.movimentacaoId}</div>;
        },
    },
    {
        accessorKey: "valor",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Valor
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const valorOriginal = row.original.valor;
            const color = valorOriginal > 0 ? "text-green-300" : "text-red-300";
            const valor = valorOriginal > 0 ? valorOriginal : Math.abs(valorOriginal);
            return (
                <div className={`${color}`}>
                    {valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
            );
        },
    },
    {
        accessorKey: "dataMovimentacao",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Data
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const data = new Date(row.original.dataMovimentacao);
            return <div>{showDateFormatted(data)}</div>;
        },
    },
];
