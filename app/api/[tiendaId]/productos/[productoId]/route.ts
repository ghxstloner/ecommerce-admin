import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productoId: string } }
) {
  try {

    if (!params.productoId) {
      return new NextResponse("El id del producto es requerido.", { status: 400 });
    }

    const producto = await prismadb.producto.findUnique({
      where: {
        id: params.productoId,
      },
      include: {
        imagenes: true,
        categoria: true,
        tamano: true,
        color: true
      }
    });

    return NextResponse.json(producto);
  } catch (error) {
    console.log("[PRODUCTO_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { tiendaId: string; productoId: string } }
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

    if(!imagenes || !imagenes.length) {
      return new NextResponse("Imagenes son necesarias.", {status: 400});
    }

    if(!nombre){
      return new NextResponse("El nombre del producto es necesario.", { status: 400 });
    }

    if(!precio){
      return new NextResponse("El precio del producto es necesario.", { status: 400 });
    }

    if(!categoriaId){
      return new NextResponse("La categoría del producto es necesario.", { status: 400 });
    }

    if(!colorId){
      return new NextResponse("El color es necesario.", { status: 400 });
    }

    if(!tamanoId){
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

    const updatedProducto = await prismadb.producto.update({
      where: {
        id: params.productoId,
      },
      data: {
        nombre,
        precio,
        esDestacado,
        esArchivado,
        categoriaId,
        colorId,
        tamanoId,
        imagenes: {
          deleteMany: {},
          createMany: {
            data: [
              ...imagenes.map((imagen: {url: string}) => imagen)
            ]
          }
        }
      },
    });

    return NextResponse.json(updatedProducto);
  } catch (error) {
    console.log("[PRODUCTO_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { tiendaId: string; productoId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.productoId) {
      return new NextResponse("El id del producto es requerido.", { status: 400 });
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

    const producto = await prismadb.producto.delete({
      where: {
        id: params.productoId,
      },
    });

    return NextResponse.json(producto);
  } catch (error) {
    console.log("[PRODUCTO_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
