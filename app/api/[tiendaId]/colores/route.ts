import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  { params }: { params: { tiendaId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { nombre, valor } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if(!nombre) {
      return new NextResponse("El nombre es necesario.", {status: 400})
    }

    if(!valor) {
      return new NextResponse("El valor es necesario.", {status: 400})
    }

    const storeByUserId = await prismadb.tienda.findFirst({
      where: {
        id: params.tiendaId,
        usuarioId: userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Sin autorización.", { status: 403 });
    }

    const color = await prismadb.color.create({
      data: {
        nombre,
        valor,
        tiendaId: params.tiendaId
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_POST]", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { tiendaId: string} }
) {
  try {

    if(!params.tiendaId){
      return new NextResponse("El ID de la tienda es necesario", {status: 400});
    }

    const color = await prismadb.color.findMany({
      where: {
        tiendaId: params.tiendaId
      }
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
