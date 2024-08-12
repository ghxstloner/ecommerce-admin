"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Server } from "lucide-react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ApiAlertAlertProps {
    title: string;
    description: string;
    variant: "public" | "admin"
}

const textMap: Record<ApiAlertAlertProps["variant"], string> = {
    public: "Public",
    admin: "Admin"
}

const variantMap: Record<ApiAlertAlertProps["variant"], BadgeProps["variant"]> = {
    public: "secondary",
    admin: "destructive"
};

export const ApiAlert: React.FC<ApiAlertAlertProps> = ({
    title,
    description,
    variant = "public"
}) => {
    const onCopy = () => {
        navigator.clipboard.writeText(description);
        toast.success("Ruta del API copiada al portapapeles.")
    }

    return(
        <Alert>
            <Server className="h-4 w-4"/>
            <AlertTitle className="flex items-center gap-x-2">
                {title}
                <Badge variant={variantMap[variant]}>
                    {textMap[variant]}
                    </Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 flex items-center justify-between">
                <code className="relative rounded bg-muted px-[0.rem] py-[0.2rem] font-mono text-sm font-semibold">
                    {description}
                </code>
                <Button variant="outline" size="icon" onClick={() => onCopy()}>
                    <Copy className="h-4 w-4"/>
                </Button>
            </AlertDescription>
        </Alert>
    )
}