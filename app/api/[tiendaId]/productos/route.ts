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
    const body = await req.json();
  
    const { 
      nombre,
      precio,
      categoriaId,
      colorId,
      tamanoId,
      imagenes,
      esDestacado,
      esArchivado
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!imagenes || !imagenes.length) {
      return new NextResponse("Imagenes son necesarias.", { status: 400 });
    }

    if (!nombre) {
      return new NextResponse("El nombre del producto es necesario.", { status: 400 });
    }

    if (!precio) {
      return new NextResponse("El precio del producto es necesario.", { status: 400 });
    }

    if (!categoriaId) {
      return new NextResponse("La categoría del producto es necesario.", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("El color es necesario.", { status: 400 });
    }

    if (!tamanoId) {
      return new NextResponse("El tamaño es necesario.", { status: 400 });
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

    const savedImages = [];
    for (const imagen of imagenes) {
      const mimeType = imagen.url.match(/data:(image\/\w+);base64,/i)?.[1];
      if (!mimeType) {
        return new NextResponse("Formato de imagen no soportado.", { status: 400 });
      }

      const extension = mimeType.split('/')[1];
      const uniqueFileName = `${uuidv4()}.${extension}`;
      const imagePath = path.join(process.cwd(), `public/${params.tiendaId}/productos/${uniqueFileName}`);

      const base64Data = imagen.url.replace(/^data:image\/\w+;base64,/, "");

      await fs.mkdir(path.dirname(imagePath), { recursive: true });
      await fs.writeFile(imagePath, base64Data, 'base64');

      savedImages.push({ url: `/${params.tiendaId}/productos/${uniqueFileName}` });
    }

    const producto = await prismadb.producto.create({
      data: {
        nombre,
        precio,
        esDestacado,
        esArchivado,
        categoriaId,
        colorId,
        tamanoId,
        tiendaId: params.tiendaId,
        imagenes: {
          createMany: {
            data: savedImages,
          },
        },
      },
    });

    return NextResponse.json(producto);
  } catch (error) {
    console.log("[PRODUCTO_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { tiendaId: string; productoId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoriaId = searchParams.get("categoriaId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const tamanoId = searchParams.get("tamanoId") || undefined;
    const esDestacado = searchParams.get("esDestacado") || undefined;


    const productos = await prismadb.producto.findMany({
      where : {
        tiendaId: params.tiendaId,
        categoriaId,
        colorId,
        tamanoId,
        esDestacado: esDestacado ? true : undefined,
        esArchivado: false
      },
      include: {
        imagenes: true,
        categoria: true,
        color: true,
        tamano: true
      },
      orderBy: {
        creadoEn: "desc"
      }
    });

    return NextResponse.json(productos);
  } catch (error) {
    console.log("[PRODUCTO_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
