import prismadb from "@/lib/prismadb";
import { TamanoForm } from "./components/tamano-form";

const TamanoPage = async ({
    params
}: {
    params: {tamanoId: string}
}) => {
    const tamano = await prismadb.tamano.findUnique({
        where : {
            id: params.tamanoId
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <TamanoForm
                    initialData={tamano}
                />
            </div>
        </div>
    );
}
 
export default TamanoPage;