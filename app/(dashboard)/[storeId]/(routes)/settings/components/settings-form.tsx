"use client";

import { Tienda } from "@prisma/client";
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
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
    initialData: Tienda;
}

const formSchema = z.object({
    nombre: z.string().min(1)
})

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const[open, setOpen] = useState(false);
    const[loading, setLoading] = useState(false);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/tiendas/${params.storeId}`, data)
            router.refresh();
            toast.success("Tienda actualizada correctamente.")
        } catch(error){
            toast.error("Algo salió mal.")
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/tiendas/${params.storeId}`)
            router.refresh();
            router.push("/")
            toast.success("Tienda eliminada.");

        } catch(error){
            toast.error("Debes eliminar todos los productos y las categorías primero.")
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
                    title="Ajustes"
                    description="Personaliza tu tienda"
                />
                <Button
                disabled={loading}
                variant="destructive"
                size="icon"
                onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4"></Trash>
                </Button>
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
                                        <Input disabled={loading} placeholder="Nombre de la tienda" {...field}></Input>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        Guardar Cambios
                    </Button>
                </form>
            </Form>
            <Separator/>
            <ApiAlert 
            title="NEXT_PUBLIC_API_URL" 
            description={`${origin}/api/${params.storeId}`} 
            variant="public"/>

        </>
      );
}
 