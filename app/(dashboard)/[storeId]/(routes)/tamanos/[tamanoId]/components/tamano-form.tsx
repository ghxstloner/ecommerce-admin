"use client";

import { Tamano } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";

const formSchema = z.object({
    nombre: z.string().min(1, { message: "El nombre del Tamaño es necesario." }),
    valor: z.string().min(1, { message: "El valor del tamaño es necesario." })
});

interface TamanoFormProps {
    initialData: Tamano | null;
}

type TamanoFormValues = z.infer<typeof formSchema>;

export const TamanoForm: React.FC<TamanoFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const[open, setOpen] = useState(false);
    const[loading, setLoading] = useState(false);

    const title         = initialData ? "Editar tamaño" : "Crear tamaño";
    const description   = initialData ? "Editar un tamaño" : "Agregar nuevo tamaño";
    const toastMessage  = initialData ? "Tamaños actualizados correctamente" : "Nuevo tamaño creado correctamente";
    const action        = initialData ? "Guardar Cambios" : "Crear";


    const form = useForm<TamanoFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            nombre: '',
            valor: ''
        }
    })
    const onSubmit = async (data: TamanoFormValues) => {
        try {
            setLoading(true);
    
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/tamanos/${params.tamanoId}`, data);
            } else {
                console.log(`Info que se manda: ${data}`);
                await axios.post(`/api/${params.storeId}/tamanos`, data);
            }
    
            router.refresh();
            router.push(`/${params.storeId}/tamanos`)
            router.refresh();
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Algo salió mal.");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/tamanos/${params.tamanoId}`)
            router.refresh();
            router.push(`/${params.storeId}/tamanos`);
            toast.success("Tamaño eliminado correctamente.")
            router.refresh();
        } catch(error){
            toast.error("Debes eliminar todos los productos que están asociados a este tamaño.")
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
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />
                {initialData && (
                <Button
                disabled={loading}
                variant="destructive"
                size="icon"
                onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4"></Trash>
                </Button>
                )}
            </div>
            <Separator/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="grid grid-cols-3 gap-8">

                <FormField
                    control={form.control}
                    name="nombre"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Nombre del Tamaño" {...field}></Input>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    </div>
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="valor"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Valor</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Valor del Tamaño" {...field}></Input>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>

        </>
      );
}
 