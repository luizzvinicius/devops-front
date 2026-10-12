"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/app/(private)/pessoa/-components/table/data-table-features";
import type { PessoaResponseDto } from "@/models/pessoa-model";
import { Button } from "@/components/ui/button";
import type { AnyFormApi } from "@tanstack/react-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { showCpfFormatted } from "@/utils/util";
import { toast } from "sonner";

type PessoaColumn = PessoaResponseDto & {
    form: AnyFormApi;
};

export const columns = (
    openDialogId: number | null,
    setOpenDialogId: (id: number | null) => void,
    deletePessoa: (id: number) => Promise<void>,
): ColumnDef<DataTableFeatures, PessoaColumn>[] => [
        {
            accessorKey: "nome",
            header: "Nome",
            cell: ({ row }) => {
                return <div>{row.original.nome}</div>;
            },
        },
        {
            accessorKey: "cpf",
            header: "CPF",
            cell: ({ row }) => {
                const cpf = row.original.cpf;
                return <div>{showCpfFormatted(cpf)}</div>;
            },
        },
        {
            accessorKey: "endereco",
            header: "Endereço",
            cell: ({ row }) => {
                return <div>{row.original.endereco}</div>;
            },
        },
        {
            header: "Editar",
            cell: ({ row }) => {
                return (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={_ => {
                            row.original.form.reset({
                                id: row.original.id,
                                name: row.original.nome,
                                cpf: showCpfFormatted(row.original.cpf),
                                address: row.original.endereco,
                            });
                        }}
                    >
                        Editar
                    </Button>
                );
            },
        },
        {
            header: "Remover",
            cell: ({ row }) => {
                const pessoaId = row.original.id;
                return (
                    <Dialog
                        open={openDialogId === pessoaId}
                        onOpenChange={open => setOpenDialogId(open ? pessoaId : null)}
                    >
                        <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                Remover
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-custom">Confirmar Remoção</DialogTitle>
                                <DialogDescription className="text-base text-custom">
                                    Tem certeza que deseja remover {row.original.nome}?
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
                                            await deletePessoa(pessoaId);
                                        } catch {
                                            toast.error("Erro ao deletar conta");
                                        }
                                        setOpenDialogId(null);
                                    }}
                                >
                                    Remover
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                );
            },
        },
    ];