import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prismadb from '@/lib/prismadb';

export async function POST(
    req: Request,
) {
    try {
        const { userId } = auth()
        const body = await req.json()
        const { name } = body;

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if(!name) {
            return new NextResponse("El nombre de la tienda es necesario.", {status:400})
        }

        const store = await prismadb.tienda.create({
            data: {
                nombre: name,
                usuarioId: userId,
            }
        })

        return NextResponse.json(store);

    } catch (error){
        console.log('[STORES_POST]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}