import {format} from "date-fns";
import { es } from 'date-fns/locale';

import { PedidoColumn } from "./components/columns";
import { PedidoClient } from "./components/client";
import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

const PedidosPage = async ({
    params
}: {
    params: {storeId: string}
}) => {
    const pedidos = await prismadb.pedido.findMany({
        where:{
            tiendaId: params.storeId
        },
        include: {
            itemsPedido: {
                include: {
                    producto: true
                }
            }
        },
        orderBy: {
            creadoEn: 'desc'
        }
    });

    const formattedPedidos: PedidoColumn[] = pedidos.map((item) => ({
        id: item.id,
        numeroTelefono: item.numeroTelefono,
        direccion: item.direccion,
        productos: item.itemsPedido.map((itemsPedido) => itemsPedido.producto.nombre).join(', '),
        precioTotal: formatter.format(
            item.itemsPedido.reduce((total, item) => {
                return total + Number(item.producto.precio);
            }, 0)
        ),
        estaPagado: item.estaPagado,
        creadoEn: format(new Date(item.creadoEn), "MMMM do, yyyy", { locale: es })
    }));
    

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <PedidoClient data={formattedPedidos} />
            </div>
        </div>
      );
}
 
export default PedidosPage;