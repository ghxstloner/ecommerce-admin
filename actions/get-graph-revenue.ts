import prismadb from "@/lib/prismadb";

interface GraphData {
    nombre: string,
    total: number
}

export const getGraphRevenue = async (tiendaId: string) => {
    const pedidosPagos = await prismadb.pedido.findMany({
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

    const monthlyRevenue: {[key:number]: number} = {}
    for(const pedido of pedidosPagos){
        const month = pedido.creadoEn.getMonth();
        let revenueForOrder =0;

        for(const item of pedido.itemsPedido){
            revenueForOrder += item.producto.precio.toNumber();
        };

        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;

    };
    const graphData: GraphData[] = [
        { nombre: "Ene", total: 0 },
        { nombre: "Feb", total: 0 },
        { nombre: "Mar", total: 0 },
        { nombre: "Abr", total: 0 },
        { nombre: "May", total: 0 },
        { nombre: "Jun", total: 0 },
        { nombre: "Jul", total: 0 },
        { nombre: "Ago", total: 0 },
        { nombre: "Sep", total: 0 },
        { nombre: "Oct", total: 0 },
        { nombre: "Nov", total: 0 },
        { nombre: "Dic", total: 0 }
    ];

    for (const month in monthlyRevenue){
        graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }
    
    return graphData;
};