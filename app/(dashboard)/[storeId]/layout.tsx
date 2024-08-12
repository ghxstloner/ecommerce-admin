import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation"
import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { tiendaId : string }
}) {
    const {userId} = auth();

    if(!userId){
        redirect('/sign-in')
    }

    const store = await prismadb.tienda.findFirst({
        where: {
            id: params.tiendaId,
            usuarioId: userId
        }
    })

    if(!store) {
        redirect('/')
    }

    return(
        <>
            <Navbar/>
            {children}
        </>
    )
}