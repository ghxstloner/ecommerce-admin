"use client";

import * as z from "zod";
import { useState } from "react";
import axios from 'axios';
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const formSchema = z.object({
    name: z.string().min(1, { message: "El nombre debe contener al menos 1 carácter" }),
});

export const StoreModal = () => {
    const storeModal = useStoreModal();
    const [loading, setLoading] = useState(false);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            setLoading(true);
            const response = await axios.post('/api/tiendas', values);

            window.location.assign(`/${response.data.id}`)
            toast.success("Tienda creada satisfactoriamente.")
        } catch(error){
            toast.error("Algo salió mal.")
        } finally {
            setLoading(false);
        }
    }

    return(
    <Modal
        title="Crear nueva tienda"
        description="Agrega una tienda para manejar los productos y categorías"
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}
    >
        <div>
            <div className="space-y-4 py-2 pb-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) =>(
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input 
                                        disabled={loading} 
                                        placeholder="E-Commerce" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )}
                        />
                        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                            <Button
                            disabled={loading} 
                            variant="outline" 
                            onClick={storeModal.onClose}>
                                Cancelar
                            </Button>
                            <Button  
                            disabled={loading} 
                            type="submit">Continuar
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>

    </Modal>
    );
};