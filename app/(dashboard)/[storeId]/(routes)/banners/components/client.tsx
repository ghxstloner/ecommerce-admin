"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BannerColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Apilist } from "@/components/ui/api-list";

interface BillboardClientProps {
    data: BannerColumn[]
}

export const BannerClient: React.FC<BillboardClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Banners (${data.length})`}
                    description="Organiza los banners de tu empresa."
                />
                <Button onClick={() => router.push(`/${params.storeId}/banners/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Agregar
                </Button>
            </div>
            <Separator/>

            <DataTable searchKey="label" columns={columns} data={data}/>

            <Heading title="API" description="Endpoint para los banners"/>
            <Separator/>
            <Apilist
                entityName="banners"
                entityIdName="bannerId"
            />
        </>
    )
}