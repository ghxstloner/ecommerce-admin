interface DashboardPageProps {
    params: {storeId: string}
};

const DashboardPage: React.FC<DashboardPageProps> = async ({
    params
}) => {
    const store = await prisma.tienda.findFirst({
        where: {
            id: params.storeId
        }
    })
    console.log("Tienda: ", store);
    return (
        <div>
            Active Store: {store?.nombre}
        </div>
    )
}

export default DashboardPage;