"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type BannerColumn = {
  id: string
  label: string
  creadoEn: string
}

export const columns: ColumnDef<BannerColumn>[] = [
  {
    accessorKey: "label",
    header: "Texto",
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
