import prismadb from "@/lib/prismadb";

export const getStockCount = async (tiendaId: string) => {
    const stockCount = await prismadb.producto.count({
        where: {
            tiendaId,
            esArchivado: false
        },
    });

    return stockCount;
}