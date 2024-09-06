import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (tiendaId: string) => {
    const pedidosPagados = await prismadb.pedido.findMany({
        where: {
            tiendaId,
            estaPagado: true
        },
        include:{
            itemsPedido: {
                include: {
                    producto: true
                }
            }
        }
    });

    const totalRevenue = pedidosPagados.reduce((total, pedido) => {
        const pedidoTotal = pedido.itemsPedido.reduce((sumaPedido, item) => {
            return sumaPedido + item.producto.precio.toNumber();
        }, 0);
        return total + pedidoTotal;
    }, 0);
    return totalRevenue;
}