"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type ProductoColumn = {
  id: string;
  nombre: string;
  precio: string;
  tamano: string;
  categoria: string;
  color: string;
  esDestacado: boolean;
  esArchivado: boolean; 
  creadoEn: string;
}

export const columns: ColumnDef<ProductoColumn>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "esArchivado",
    header: "Archivado",
  },
  {
    accessorKey: "esDestacado",
    header: "Destacado",
  },
  {
    accessorKey: "precio",
    header: "Precio",
  },
  {
    accessorKey: "categoria",
    header: "Categoria",
  },
  {
    accessorKey: "tamano",
    header: "Tamaño",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({row}) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div
          className="border h-6 w-6 rounded-full"
          style={{backgroundColor: row.original.color}}
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
