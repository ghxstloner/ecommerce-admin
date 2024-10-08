import prismadb from "@/lib/prismadb";
import { ProductoForm } from "./components/producto-form";

const ProductoPage = async ({
    params
}: {
    params: {productoId: string, storeId: string}
}) => {
    const producto = await prismadb.producto.findUnique({
        where : {
            id: params.productoId
        }, include: {
            imagenes: true
        }
    })

    const categorias = await prismadb.categoria.findMany({
        where: {
            tiendaId: params.storeId
        }
    });

    const tamanos = await prismadb.tamano.findMany({
        where: {
            tiendaId: params.storeId
        }
    });

    const colores = await prismadb.color.findMany({
        where: {
            tiendaId: params.storeId
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductoForm
                    initialData={producto}
                    categorias={categorias}
                    colores ={colores}
                    tamanos={tamanos}
                />
            </div>
        </div>
    );
}
 
export default ProductoPage;