import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params}: {params: {tiendaId: string}}
){
    try {
        const {userId} = auth();
        const body = await req.json();
        const {nombre} = body;

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!nombre){
            return new NextResponse("El nombre es requerido.", {status: 400})
        }
        
        if(!params.tiendaId){
            return new NextResponse("El id de la tienda es requerido.", {status: 400})
        }

        const store = await prismadb.tienda.updateMany({
            where: {
                id: params.tiendaId,
                usuarioId: userId
            },
            data: {
                nombre
            }
        })

        return NextResponse.json(store);
    } catch(error){
        console.log('[STORE_PATCH]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function DELETE(
    req: Request,
    {params}: {params: {tiendaId: string}}
){
    try {
        const {userId} = auth();

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!params.tiendaId){
            return new NextResponse("El id de la tienda es requerido.", {status: 400})
        }

        const store = await prismadb.tienda.deleteMany({
            where: {
                id: params.tiendaId,
                usuarioId: userId
            }
        })

        return NextResponse.json(store);
    } catch(error){
        console.log('[STORE_DELETE]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}