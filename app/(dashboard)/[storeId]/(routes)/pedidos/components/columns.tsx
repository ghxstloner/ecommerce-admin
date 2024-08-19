"use client"

import { ColumnDef } from "@tanstack/react-table"

export type PedidoColumn = {
  id: string
  numeroTelefono: string
  direccion: string
  estaPagado: boolean
  precioTotal: string
  productos: string
  creadoEn: string
}

export const columns: ColumnDef<PedidoColumn>[] = [
  {
    accessorKey: "productos",
    header: "Productos",
  },
  {
    accessorKey: "numeroTelefono",
    header: "Número de Teléfono",
  },
  {
    accessorKey: "direccion",
    header: "Dirección",
  },
  {
    accessorKey: "precioTotal",
    header: "Precio Total",
  },
  {
    accessorKey: "estaPagado",
    header: "Pago",
  },
]
