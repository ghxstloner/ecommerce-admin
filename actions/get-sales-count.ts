import prismadb from "@/lib/prismadb";

export const getSalesCount = async (tiendaId: string) => {
    const salesCount = await prismadb.pedido.count({
        where: {
            tiendaId,
            estaPagado: true
        },
    });

    return salesCount;
}