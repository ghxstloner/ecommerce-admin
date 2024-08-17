import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prismadb from '@/lib/prismadb';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  req: Request,
  { params }: { params: { tiendaId: string } }
) {
  try {
    const { userId } = auth();
    const { label, imageUrl } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label || !imageUrl) {
      return new NextResponse("Label e imagen son requeridos", { status: 400 });
    }

    if (!params.tiendaId) {
      return new NextResponse("El id de la tienda es requerido.", { status: 400 });
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

    const mimeType = imageUrl.match(/data:(image\/\w+);base64,/i)?.[1];
    if (!mimeType) {
      return new NextResponse("Formato de imagen no soportado.", { status: 400 });
    }

    const extension = mimeType.split('/')[1];
    
    const uniqueFileName = `${uuidv4()}.${extension}`;
    const imagePath = path.join(process.cwd(), `public/${params.tiendaId}/${uniqueFileName}`);

    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");

    await fs.mkdir(path.dirname(imagePath), { recursive: true });
    await fs.writeFile(imagePath, base64Data, 'base64');

    const banner = await prismadb.banner.create({
      data: {
        label,
        imageUrl: `/${params.tiendaId}/${uniqueFileName}`,
        tiendaId: params.tiendaId,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.log("[STORE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { tiendaId: string; bannerId: string } }
) {
  try {
    const banner = await prismadb.banner.findMany({
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.log("[BANNER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
