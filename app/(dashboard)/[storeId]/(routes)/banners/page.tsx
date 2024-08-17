import {format} from "date-fns";
import { es } from 'date-fns/locale';

import { BannerColumn } from "./components/columns";
import { BannerClient } from "./components/client";
import prismadb from "@/lib/prismadb";

const BannersPage = async ({
    params
}: {
    params: {storeId: string}
}) => {
    const banners = await prismadb.banner.findMany({
        where:{
            tiendaId: params.storeId
        },
        orderBy: {
            creadoEn: 'desc'
        }
    });

    const formattedBanners: BannerColumn[] = banners.map((item) => ({
        id: item.id,
        label: item.label,
        creadoEn: format(new Date(item.creadoEn), "MMMM do, yyyy", { locale: es })
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BannerClient data={formattedBanners} />
            </div>
        </div>
      );
}
 
export default BannersPage;