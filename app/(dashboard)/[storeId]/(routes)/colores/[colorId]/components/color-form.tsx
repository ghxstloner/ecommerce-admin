"use client";

import { Color } from "@prisma/client";
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
    nombre: z.string().min(1, { message: "El nombre del color es necesario." }),
    valor: z.string().min(4).regex(/^/, {
        message: "El color debe de ser un valor hexadecimal válido."
    })
});
 
interface ColorFormProps {
    initialData: Color | null;
}

type ColorFormValues = z.infer<typeof formSchema>;

export const ColorForm: React.FC<ColorFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const[open, setOpen] = useState(false);
    const[loading, setLoading] = useState(false);

    const title         = initialData ? "Editar color" : "Crear color";
    const description   = initialData ? "Editar un color" : "Agregar nuevo color";
    const toastMessage  = initialData ? "Colores actualizados correctamente" : "Nuevo color creado correctamente";
    const action        = initialData ? "Guardar Cambios" : "Crear";


    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            nombre: '',
            valor: ''
        }
    })
    const onSubmit = async (data: ColorFormValues) => {
        try {
            setLoading(true);
    
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/colores/${params.colorId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/colores`, data);
            }
    
            router.refresh();
            router.push(`/${params.storeId}/colores`)
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
            await axios.delete(`/api/${params.storeId}/colores/${params.colorId}`)
            router.refresh();
            router.push(`/${params.storeId}/colores`);
            toast.success("Color eliminado correctamente.")
            router.refresh();
        } catch(error){
            toast.error("Debes eliminar todos los productos que están asociados a este color.")
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
                                <Input disabled={loading} placeholder="Nombre del Color" {...field}></Input>
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
                                        <div className="flex items-center gap-x-4">
                                            <Input disabled={loading} placeholder="Valor del Color" {...field}></Input>
                                            <div
                                                className="border p-4 rounded-full"
                                                style={{background:field.value}}
                                            />
                                        </div>
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
 