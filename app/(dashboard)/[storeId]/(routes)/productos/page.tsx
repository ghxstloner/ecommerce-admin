import {format} from "date-fns";
import { es } from 'date-fns/locale';

import { ProductoColumn } from "./components/columns";
import { ProductoClient } from "./components/client";
import prismadb from "@/lib/prismadb";
import { createFormatter } from "@/lib/utils";

const ProductosPage = async ({
    params
}: {
    params: {storeId: string}
}) => {
    const productos = await prismadb.producto.findMany({
        where:{
            tiendaId: params.storeId
        },
        include: {
            categoria: true,
            tamano: true,
            color: true
        },
        orderBy: {
            creadoEn: 'desc'
        }
    });

    const tienda = await prismadb.tienda.findUnique({
        where: { id: params.storeId },
        select: { divisa: true }
    });

    const divisa = tienda?.divisa || "USD";
    const formatter = createFormatter(divisa);

    const formattedProductos: ProductoColumn[] = productos.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        esDestacado: item.esDestacado,
        esArchivado: item.esArchivado,
        precio: formatter.format(item.precio.toNumber()),
        categoria: item.categoria.nombre,
        tamano: item.tamano.nombre,
        color: item.color.valor,
        creadoEn: format(new Date(item.creadoEn), "MMMM do, yyyy", { locale: es })
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductoClient data={formattedProductos} />
            </div>
        </div>
      );
}
 
export default ProductosPage;