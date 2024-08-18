"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type TamanoColumn = {
  id: string
  valor: string
  nombre: string
  creadoEn: string
}

export const columns: ColumnDef<TamanoColumn>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre Tamaño/Talla",
  },
  {
    accessorKey: "valor",
    header: "Valor",
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
