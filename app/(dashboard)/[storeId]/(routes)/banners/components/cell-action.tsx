"use client";

import { DropdownMenu, 
    DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { BannerColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
    data: BannerColumn;
}

export  const CellAction: React.FC<CellActionProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("ID copiado al portapapeles.")
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/banners/${data.id}`)
            router.refresh();
            toast.success("Banner eliminado correctamente.")
        } catch(error){
            toast.error("Debes eliminar todas las categorías que usan este banner primero.")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }


    return (
        <>
        <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
        />
            <DropdownMenu>
            <DropdownMenuTrigger>
    <div className="h-8 w-8 p-0 flex items-center justify-center cursor-pointer">
        <span className="sr-only">Abrir menú</span>
        <MoreHorizontal className="h-4 w-4"/>
    </div>
        </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Acciones
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4"/>
                        Copiar ID
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/banners/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4"/>
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4"/>
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
 