"use client"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  FilterFnOption
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageSize?: number,
  searchFields: string[],
  defaultSearch?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 20,
  searchFields = [],
  defaultSearch = ""
}: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = useState(defaultSearch)
    const [searchValue] = useState(defaultSearch)
    useEffect(() => {
        const timer = setTimeout(() => {
          setGlobalFilter(searchValue);
        }, 300);
    
        return () => clearTimeout(timer);
    }, [searchValue]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    filterFns: {
        fuzzy: (row, _, search) => {
            const data = row.original
            return searchFields.some(field => data[field].toString().includes(search))
        }
    },
    globalFilterFn: "fuzzy" as FilterFnOption<TData>,
    state: {
        globalFilter
    },
    initialState: {
      pagination: {
        pageSize
      }, 
    }
  })

  return (
    <div>
        <div className="flex items-center py-4">
        {/* <Input
          placeholder={"Buscar por: " + searchFields}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="max-w-sm"
        /> */}
      </div>
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                        <TableHead key={header.id} className="text-custom text-center">
                            {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                        </TableHead>
                        )
                    })}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="text-center text-custom"
                    >
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-custom">
                        Sem resultados
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
    </div>
  )
}