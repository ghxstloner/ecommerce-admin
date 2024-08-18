import {format} from "date-fns";
import { es } from 'date-fns/locale';

import { TamanoColumn } from "./components/columns";
import { TamanoClient } from "./components/client";
import prismadb from "@/lib/prismadb";

const TamanosPage = async ({
    params
}: {
    params: {storeId: string}
}) => {
    const tamanos = await prismadb.tamano.findMany({
        where:{
            tiendaId: params.storeId
        },
        orderBy: {
            creadoEn: 'desc'
        }
    });

    const formattedTamanos: TamanoColumn[] = tamanos.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        valor: item.valor,
        creadoEn: format(new Date(item.creadoEn), "MMMM do, yyyy", { locale: es })
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <TamanoClient data={formattedTamanos} />
            </div>
        </div>
      );
}
 
export default TamanosPage;