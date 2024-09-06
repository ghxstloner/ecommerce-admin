import { promises as fs } from 'fs';
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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
    var { label, imageUrl } = body;

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

    if (imageUrl.startsWith("data:")) {
      const mimeType = imageUrl.match(/data:(image\/\w+);base64,/i)?.[1];
      if (!mimeType) {
          return new NextResponse("Formato de imagen no soportado.", { status: 400 });
      }
  
      const extension = mimeType.split('/')[1];
      const uniqueFileName = `${uuidv4()}.${extension}`;
      const imagePath = path.join(process.cwd(), `public/${params.tiendaId}/banners/${uniqueFileName}`);
  
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
  
      await fs.mkdir(path.dirname(imagePath), { recursive: true });
      await fs.writeFile(imagePath, base64Data, 'base64');
  
      imageUrl = `/${params.tiendaId}/banners/${uniqueFileName}`;
    }
    
    const banner = await prismadb.banner.update({
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
