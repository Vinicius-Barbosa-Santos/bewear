import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductList from "@/components/common/products-list";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

import ProductActions from "./components/product-actions";
import VariantSelector from "./components/variant-selector";

interface ProductVariantPageProps {
    params: Promise<{ slug: string }>;
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
    const { slug } = await params;
    const productVariant = await db.query.productVariantTable.findFirst({
        where: eq(productVariantTable.slug, slug),
        with: {
            product: {
                with: {
                    variants: true,
                },
            },
        },
    });
    if (!productVariant) {
        return notFound();
    }
    const likelyProducts = await db.query.productTable.findMany({
        where: eq(productTable.categoryId, productVariant.product.categoryId),
        with: {
            variants: true,
        },
    });
    return (
        <>
            <Header />
            <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-8 md:px-8 md:py-6">
                <div className="md:w-1/2">
                    <Image
                        src={productVariant.imageUrl}
                        alt={productVariant.name}
                        sizes="100vw"
                        height={0}
                        width={0}
                        className="h-auto w-full object-cover md:rounded-lg"
                    />

                </div>

                <div className="flex flex-col space-y-6 px-5 md:w-1/2 md:px-0">
                    <div>
                        <h2 className="text-2xl font-semibold">
                            {productVariant.product.name}
                        </h2>
                        <h3 className="text-muted-foreground text-sm">
                            {productVariant.name}
                        </h3>
                        <h3 className="mt-2 text-xl font-semibold">
                            {formatCentsToBRL(productVariant.priceInCents)}
                        </h3>
                    </div>

                    <div>
                        <h3 className="mb-2 font-medium">Selecionar tamanho</h3>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="flex h-12 items-center justify-center rounded-md border hover:border-primary">P</div>
                            <div className="flex h-12 items-center justify-center rounded-md border hover:border-primary">M</div>
                            <div className="flex h-12 items-center justify-center rounded-md border hover:border-primary">G</div>
                            <div className="flex h-12 items-center justify-center rounded-md border hover:border-primary">GG</div>
                            <div className="flex h-12 items-center justify-center rounded-md border hover:border-primary">GGG</div>
                            <div className="flex h-12 items-center justify-center rounded-md border hover:border-primary">GGGG</div>
                        </div>
                    </div>

                    <ProductActions productVariantId={productVariant.id} />

                    <div>
                        <VariantSelector
                            selectedVariantSlug={productVariant.slug}
                            variants={productVariant.product.variants}
                        />
                    </div>

                    <div>
                        <h3 className="mb-2 font-medium">Descrição</h3>
                        <p className="text-muted-foreground text-sm">
                            {productVariant.product.description}
                        </p>
                    </div>
                </div>

            </div>

            <div className="mt-12">
                <ProductList title="Talvez você goste" products={likelyProducts} />
            </div>

            <div className="mt-14">
                <Footer />
            </div>
        </>
    );
};

export default ProductVariantPage;