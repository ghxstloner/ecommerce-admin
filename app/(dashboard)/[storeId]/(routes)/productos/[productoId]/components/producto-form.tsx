"use client";

import { Categoria, Imagen, Producto, Tamano, Color } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import {ImageUpload} from "@/components/image-upload";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
    nombre: z.string().min(1),
    imagenes: z.object({ url: z.string()}).array(),
    precio: z.coerce.number().min(1),
    categoriaId: z.string().min(1),
    colorId: z.string().min(1),
    tamanoId: z.string().min(1),
    esArchivado: z.boolean().default(false).optional(),
    esDestacado: z.boolean().default(false).optional()
})

interface ProductoFormProps {
    initialData: Producto & {
        imagenes: Imagen[]
    } | null;
    categorias: Categoria[];
    colores: Color[];
    tamanos: Tamano[];
}

type ProductoFormValues = z.infer<typeof formSchema>;

export const ProductoForm: React.FC<ProductoFormProps> = ({
    initialData,
    categorias,
    colores,
    tamanos
}) => {
    const params = useParams();
    const router = useRouter();

    const[open, setOpen] = useState(false);
    const[loading, setLoading] = useState(false);

    const title         = initialData ? "Editar producto" : "Crear producto";
    const description   = initialData ? "Editar un producto" : "Agregar nuevo producto";
    const toastMessage  = initialData ? "Producto actualizado correctamente" : "Producto creado correctamente";
    const action        = initialData ? "Guardar Cambios" : "Crear";


    const form = useForm<ProductoFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            precio: parseFloat(String(initialData?.precio))
        } : {
            nombre: '',
            imagenes: [],
            precio: 0,
            categoriaId: '',
            colorId: '',
            tamanoId: '',
            esArchivado: false,
            esDestacado: false
        }
    });

    const onSubmit = async (data: ProductoFormValues) => {
        try {
            setLoading(true);
    
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/productos/${params.productoId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/productos`, data);
            }
    
            router.refresh();
            router.push(`/${params.storeId}/productos`)
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
            await axios.delete(`/api/${params.storeId}/productos/${params.productoId}`)
            router.refresh();
            router.push(`/${params.storeId}/productos`);
            toast.success("Producto eliminado correctamente.")
            router.refresh();
        } catch(error){
            toast.error("Debes eliminar todas las categorías que usan este prod primero.")
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
                <FormField
                    control={form.control}
                    name="imagenes"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Imágenes</FormLabel>
                            <FormControl>
                            <ImageUpload
                                onChange={(urls) =>
                                    field.onChange(
                                        Array.isArray(urls)
                                            ? urls.map((url) => ({ url }))
                                            : [{ url: urls }]
                                    )
                                }
                                value={
                                    Array.isArray(field.value)
                                        ? field.value.map((imageObj) =>
                                            typeof imageObj.url === 'string'
                                                ? imageObj.url.replace('/public', '')
                                                : ''
                                        )
                                        : typeof field.value === 'string'
                                            ? (field.value as string).replace('/public', '')
                                            : ''
                                }
                                maxFiles={5}
                            />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nombre del producto" {...field}></Input>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="precio"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Precio</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="5.99" {...field}></Input>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoriaId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Categoría</FormLabel>
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
                                                        placeholder="Selecciona una categoría"
                                                    >

                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categorias.map((categoria) => (
                                                    <SelectItem
                                                        key={categoria.id}
                                                        value={categoria.id}
                                                    >
                                                        {categoria.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tamanoId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Tamaños/Talla</FormLabel>
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
                                                        placeholder="Selecciona un tamaño o talla"
                                                    >

                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {tamanos.map((tamano) => (
                                                    <SelectItem
                                                        key={tamano.id}
                                                        value={tamano.id}
                                                    >
                                                        {tamano.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
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
                                                        placeholder="Selecciona un color"
                                                    >

                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {colores.map((color) => (
                                                    <SelectItem
                                                        key={color.id}
                                                        value={color.id}
                                                    >
                                                        {color.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="esDestacado"
                            render={({field}) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Destacado
                                        </FormLabel>
                                        <FormDescription>
                                            Este producto aparecerá en la página principal.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="esArchivado"
                            render={({field}) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Archivado
                                        </FormLabel>
                                        <FormDescription>
                                            Este producto no aparecerá en ningún lado en la tienda.
                                        </FormDescription>
                                    </div>
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
 