"use client";

import { Banner, Categoria } from "@prisma/client";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
    nombre: z.string().min(1, { message: "El nombre es necesario." }),
    bannerId: z.string().min(1, { message: "Por favor, selecciona un banner." })
});

interface CategoriaFormProps {
    initialData: Categoria | null;
    banners:     Banner[];
}

type CategoriaFormValues = z.infer<typeof formSchema>;

export const CategoriaForm: React.FC<CategoriaFormProps> = ({
    initialData,
    banners
}) => {
    const params = useParams();
    const router = useRouter();

    const[open, setOpen] = useState(false);
    const[loading, setLoading] = useState(false);

    const title         = initialData ? "Editar Categoría" : "Crear Categoria";
    const description   = initialData ? "Editar una categoría" : "Agregar nuevo categoría";
    const toastMessage  = initialData ? "Categoría actualizada correctamente" : "Categoría creada correctamente";
    const action        = initialData ? "Guardar Cambios" : "Crear";


    const form = useForm<CategoriaFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            nombre: '',
            bannerId: ''
        }
    })
    const onSubmit = async (data: CategoriaFormValues) => {
        try {
            setLoading(true);
    
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categorias/${params.categoriaId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/categorias`, data);
            }
    
            router.refresh();
            router.push(`/${params.storeId}/categorias`)
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
            await axios.delete(`/api/${params.storeId}/categorias/${params.categoriaId}`)
            router.refresh();
            router.push(`/${params.storeId}/categorias`);
            toast.success("Categoría eliminada correctamente.")
            router.refresh();
        } catch(error){
            toast.error("Debes eliminar todos los productos que usan esta categoría primero.")
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
                                        <Input disabled={loading} placeholder="Nombre de la categoría" {...field}></Input>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bannerId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Banner</FormLabel>
                                        <Select
                                            disabled={loading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        defaultValue={field.value}
                                                        placeholder="Selecciona un banner"
                                                    >

                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {banners.map((banner) => (
                                                    <SelectItem
                                                        key={banner.id}
                                                        value={banner.id}
                                                    >
                                                        {banner.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
 