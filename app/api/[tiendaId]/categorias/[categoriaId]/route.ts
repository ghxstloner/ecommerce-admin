import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { categoriaId: string } }
) {
  try {

    if (!params.categoriaId) {
      return new NextResponse("El ID de la categoría es requerido.", { status: 400 });
    }

    const categoria = await prismadb.categoria.findUnique({
      where: {
        id: params.categoriaId,
      },
      include: {
        banner: true
      }
    });

    return NextResponse.json(categoria);
  } catch (error) {
    console.log("[CATEGORIA_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { tiendaId: string; categoriaId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { nombre, bannerId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const storeByUserId = await prismadb.tienda.findFirst({
      where: {
        id: params.tiendaId,
        usuarioId: userId
      }
    })

    if (!storeByUserId) {
      return new NextResponse("Sin autorización.", { status: 403 });
    }

    const categoria = await prismadb.categoria.updateMany({
      where: {
        id: params.categoriaId,
      },
      data: {
        nombre,
        bannerId,
      },
    });

    return NextResponse.json(categoria);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { tiendaId: string; categoriaId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.categoriaId) {
      return new NextResponse("El ID de la categoría es requerido.", { status: 400 });
    }

    const storeByUserId = await prisma?.tienda.findFirst({
      where: {
        id: params.tiendaId,
        usuarioId: userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Sin autorización.", { status: 403 });
    }

    const banner = await prismadb.categoria.deleteMany({
      where: {
        id: params.categoriaId,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.log("[CATEGORIA_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
