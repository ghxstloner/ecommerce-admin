import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { connect } from "http2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", 
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(){
    return NextResponse.json({}, {headers: corsHeaders});
}

export async function POST(
    req: Request,
    { params }: { params: { tiendaId: string } }
) {
    const { productoIds } = await req.json();

    if (!productoIds || productoIds.length === 0) {
        return new NextResponse("Los ID's de los productos son requeridos", { status: 400 });
    }

    const productos = await prismadb.producto.findMany({
        where: {
            id: {
                in: productoIds,
            },
        },
    });

    if (productos.length !== productoIds.length) {
        return new NextResponse("Algunos productos no existen en la base de datos", { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    productos.forEach((producto) => {
        line_items.push({
            quantity: 1,
            price_data: {
                currency: 'USD',
                product_data: {
                    name: producto.nombre,
                },
                unit_amount: producto.precio.toNumber() * 100
            }
        });
    });

    const pedido = await prismadb.pedido.create({
        data: {
            tiendaId: params.tiendaId,
            estaPagado: false,
            itemsPedido: {
                create: productoIds.map((productoId: string) => ({
                    producto: {
                        connect: {
                            id: productoId
                        }
                    }
                }))
            }
        }
    });

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        billing_address_collection: "required",
        phone_number_collection: {
            enabled: true
        },
        success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
        cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancel=1`,
        metadata: {
            orderId: pedido.id
        }
    });

    return NextResponse.json({ url: session.url }, {
        headers: corsHeaders
    });
};