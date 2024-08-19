"use client";

import { Banner } from "@prisma/client";
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
import {ImageUpload} from "@/components/image-upload";

const formSchema = z.object({
    label: z.string().min(1, { message: "El texto es necesario." }),
    imageUrl: z.string().min(1, { message: "Por favor, sube una imagen." })
});

interface BannerFormProps {
    initialData: Banner | null;
}

type BannerFormValues = z.infer<typeof formSchema>;

export const BannerForm: React.FC<BannerFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const[open, setOpen] = useState(false);
    const[loading, setLoading] = useState(false);

    const title         = initialData ? "Editar banner" : "Crear banner";
    const description   = initialData ? "Editar un banner" : "Agregar nuevo banner";
    const toastMessage  = initialData ? "Banner actualizado correctamente" : "Banner creado correctamente";
    const action        = initialData ? "Guardar Cambios" : "Crear";


    const form = useForm<BannerFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        }
    })
    const onSubmit = async (data: BannerFormValues) => {
        try {
            setLoading(true);
    
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/banners/${params.bannerId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/banners`, data);
            }
    
            router.refresh();
            router.push(`/${params.storeId}/banners`)
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
            await axios.delete(`/api/${params.storeId}/banners/${params.bannerId}`)
            router.refresh();
            router.push(`/${params.storeId}/banners`);
            toast.success("Banner eliminado correctamente.")
            router.refresh();
        } catch(error){
            toast.error("Debes eliminar todas las categorías que usan este banner primero.")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    const maxFiles = 1;

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
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Imagen del fondo</FormLabel>
                            <FormControl>
                            <ImageUpload
                                onChange={(url) => {
                                    if (maxFiles === 1) {
                                        field.onChange(url); 
                                    } else {
                                        field.onChange(Array.isArray(url) ? url : [url]);
                                    }
                                }}
                                value={
                                    maxFiles === 1
                                        ? (typeof field.value === 'string' ? field.value.replace('/public', '') : '')
                                        : Array.isArray(field.value)
                                            ? field.value.map((imageObj) =>
                                                typeof imageObj.url === "string"
                                                    ? imageObj.url.replace('/public', '')
                                                    : ''
                                            )
                                            : []
                                }
                                maxFiles={1}
                            />

                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Texto</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Texto del Banner" {...field}></Input>
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
 