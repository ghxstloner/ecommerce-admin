import prismadb from "@/lib/prismadb";
import { CategoriaForm } from "./components/categoria-form";

const CategoryPage = async ({
    params
}: {
    params: {categoriaId: string, storeId: string}
}) => {
    const categoria = await prismadb.categoria.findUnique({
        where : {
            id: params.categoriaId
        }
    })

    const banners = await prismadb.banner.findMany({
        where: {
            tiendaId: params.storeId
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoriaForm
                    banners = {banners}
                    initialData={categoria}
                />
            </div>
        </div>
    );
}
 
export default CategoryPage;