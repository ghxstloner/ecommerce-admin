"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>){
    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/${params.storeId}`,
            label: 'Panel de Control',
            active: pathname === `/${params.storeId}`
        },
        {
            href: `/${params.storeId}/banners`,
            label: '¡Personaliza tu tienda!',
            active: pathname === `/${params.storeId}/banners`
        },
        {
            href: `/${params.storeId}/categorias`,
            label: 'Categorías',
            active: pathname === `/${params.storeId}/categorias`
        },
        {
            href: `/${params.storeId}/tamanos`,
            label: 'Tamaños',
            active: pathname === `/${params.storeId}/tamanos`
        },
        {
            href: `/${params.storeId}/colores`,
            label: 'Colores',
            active: pathname === `/${params.storeId}/colores`
        },
        {
            href: `/${params.storeId}/productos`,
            label: 'Productos',
            active: pathname === `/${params.storeId}/productos`
        },
        {
            href: `/${params.storeId}/pedidos`,
            label: 'Pedidos',
            active: pathname === `/${params.storeId}/pedidos`
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Ajustes',
            active: pathname === `/${params.storeId}/settings`
        }
    ];
    return(
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
        >
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn("text-sm font-medium transition-colors hover:text-primary",
                        route.active ?  "text-black dark:text-white" : "text-muted-foreground"
                    )}
                >
                {route.label}
                </Link>
            ))}
        </nav>
    )
};