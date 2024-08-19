"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PedidoColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface BillboardClientProps {
    data: PedidoColumn[]
}

export const PedidoClient: React.FC<BillboardClientProps> = ({
    data
}) => {

    return (
        <>
            <Heading
                title={`Pedidos (${data.length})`}
                description="Organiza los pedidos de tu tienda."
            />
            <Separator/>
            <DataTable searchKey="productos" columns={columns} data={data}/>

        </>
    )
}