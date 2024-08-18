import {format} from "date-fns";
import { es } from 'date-fns/locale';

import { CategoriaColumn } from "./components/columns";
import { CategoriaClient } from "./components/client";
import prismadb from "@/lib/prismadb";

const CategoriasPage = async ({
    params
}: {
    params: {storeId: string}
}) => {
    const categorias = await prismadb.categoria.findMany({
        where:{
            tiendaId: params.storeId
        },
        include: {
            banner: true,
        },
        orderBy: {
            creadoEn: 'desc'
        }
    });

    const formattedCategorias: CategoriaColumn[] = categorias.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        bannerLabel: item.banner.label,
        creadoEn: format(new Date(item.creadoEn), "MMMM do, yyyy", { locale: es })
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoriaClient data={formattedCategorias} />
            </div>
        </div>
      );
}
 
export default CategoriasPage;