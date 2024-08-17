import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { tiendaId: string; bannerId: string } }
) {
  try {

    if (!params.bannerId) {
      return new NextResponse("El id del banner es requerido.", { status: 400 });
    }

    const banner = await prismadb.banner.findUnique({
      where: {
        id: params.bannerId,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.log("[BANNER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { tiendaId: string; bannerId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("El nombre del texto es requerido.", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("La imagen es requerida.", { status: 400 });
    }

    if (!params.bannerId) {
      return new NextResponse("El id del banner es requerido.", { status: 400 });
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

    const banner = await prismadb.banner.updateMany({
      where: {
        id: params.bannerId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { tiendaId: string; bannerId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.bannerId) {
      return new NextResponse("El id del banner es requerido.", { status: 400 });
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

    const banner = await prismadb.banner.deleteMany({
      where: {
        id: params.bannerId,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.log("[BANNER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
