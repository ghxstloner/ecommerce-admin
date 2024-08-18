import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {

    if (!params.colorId) {
      return new NextResponse("El ID de la categoría es requerido.", { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[CATEGORIA_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { tiendaId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { nombre, valor } = body;

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

    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        nombre,
        valor,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { tiendaId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.colorId) {
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

    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
