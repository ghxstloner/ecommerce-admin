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

    const { nombre, bannerId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if(!nombre) {
      return new NextResponse("El nombre es necesario.", {status: 400})
    }

    if(!bannerId) {
      return new NextResponse("El banner es necesario.", {status: 400})
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

    const categoria = await prismadb.categoria.create({
      data: {
        nombre,
        bannerId,
        tiendaId: params.tiendaId
      },
    });

    return NextResponse.json(categoria);
  } catch (error) {
    console.log("[CATEGORIA_POST]", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string} }
) {
  try {

    if(!params.storeId) {
      return new NextResponse("El ID de la tienda es necesario", { status: 400 })
    }

    const banner = await prismadb.categoria.findMany({
      where: {
        tiendaId: params.storeId
      }
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.log("[CATEGORIA_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
