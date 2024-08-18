"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type CategoriaColumn = {
  id: string
  nombre: string
  bannerLabel: string
  creadoEn: string
}

export const columns: ColumnDef<CategoriaColumn>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "banner",
    header: "Banner",
    cell: ({row}) => row.original.bannerLabel
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
