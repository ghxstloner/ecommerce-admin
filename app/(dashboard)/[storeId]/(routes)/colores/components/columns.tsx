"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type ColorColumn = {
  id: string
  valor: string
  nombre: string
  creadoEn: string
}

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre del Color",
  },
  {
    accessorKey: "valor",
    header: "Valor",
    cell: ({row}) => (
      <div className="flex items-center gap-x-2">
        {row.original.valor}
        <div
          className="border h-6 w-6 rounded-full"
          style={{backgroundColor: row.original.valor}}
      />
      </div>
    )
  },
  {
    accessorKey: "creadoEn",
    header: "Fecha",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
