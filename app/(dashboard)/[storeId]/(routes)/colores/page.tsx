import {format} from "date-fns";
import { es } from 'date-fns/locale';

import { ColorColumn } from "./components/columns";
import { ColorClient } from "./components/client";
import prismadb from "@/lib/prismadb";

const ColorsPage = async ({
    params
}: {
    params: {storeId: string}
}) => {
    const colores = await prismadb.color.findMany({
        where:{
            tiendaId: params.storeId
        },
        orderBy: {
            creadoEn: 'desc'
        }
    });

    const formattedColores: ColorColumn[] = colores.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        valor: item.valor,
        creadoEn: format(new Date(item.creadoEn), "MMMM do, yyyy", { locale: es })
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorClient data={formattedColores} />
            </div>
        </div>
      );
}
 
export default ColorsPage;