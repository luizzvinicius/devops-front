"use client"
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import type { PessoaEConta } from "@/models/pessoa-model";
import type { AnyFormApi } from "@tanstack/react-form";
import type { DataTableFeatures } from "./data-table-features";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpDown } from "lucide-react"

export type ContasTableRow = PessoaEConta & {
  form: AnyFormApi;
};

export const columns = (
  deleteConta: (id: string) => Promise<void>,
  openDialogId: string | null,
  setOpenDialogId: (id: string | null) => void): ColumnDef<DataTableFeatures, ContasTableRow>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          data-indeterminate={
            table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "conta_id",
      header: "Número Conta",
      cell: ({ row }) => {
        return <div>{row.original.conta_id}</div>;
      },
    },
    {
      accessorKey: "nome",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nome
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div>{row.original.nome}</div>;
      },
    },
    {
      accessorKey: "cpf",
      header: "CPF",
      cell: ({ row }) => {
        return <div>{row.original.cpf}</div>;
      },
    },
    {
      accessorKey: "conta_saldo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Saldo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div>
            {row.original.conta_saldo.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "Ações",
      cell: ({ row }) => {
        const contaId = row.original.conta_id;
        return (
          <Dialog
            open={openDialogId === contaId}
            onOpenChange={open => setOpenDialogId(open ? contaId : null)}
          >
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Remover
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-custom">Confirmar Remoção</DialogTitle>
                <DialogDescription className="text-custom text-base">
                  Tem certeza que deseja remover esta conta {row.original.conta_id}?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="text-custom"
                  onClick={() => setOpenDialogId(null)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    try {
                      await deleteConta(contaId);
                    } catch {
                      toast.error("Erro ao deletar conta");
                    }
                    setOpenDialogId(null);
                  }}
                >
                  Remover conta
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      }
    }
  ]