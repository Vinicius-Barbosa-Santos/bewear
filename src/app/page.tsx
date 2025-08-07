import { desc } from "drizzle-orm";
import Image from "next/image";

import BrandList from "@/components/common/brand-list";
import CategorySelector from "@/components/common/category-selector";
import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import ProductsList from "@/components/common/products-list";
import { db } from "@/db";
import { productTable } from "@/db/schema";
import { brandImages } from "@/images/brand-images";

export default async function Home() {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });
  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });
  const categories = await db.query.categoryTable.findMany({});

  return (
    <>
      <Header />
      <div className="space-y-6 px-5">
        <Image
          src="/banner-mobile.png"
          className="h-auto w-full md:hidden"
          alt="Leve uma vida com estilo"
          width={600}
          height={400}
          sizes="100vw"
        />
        <Image
          src="/banner-desk.png"
          className="hidden h-auto w-full md:block"
          alt="Leve uma vida com estilo"
          width={1200}
          height={400}
          sizes="100vw"
        />

        <BrandList title="Marcas" images={brandImages} />

        <ProductsList title="Mais Vendidos" products={products} />

        <div className="md:hidden">
          <CategorySelector categories={categories} />
        </div>

        <Image
          src="/banner2-mobile.png"
          className="h-auto w-full md:hidden"
          alt="Leve uma vida com estilo"
          width={600}
          height={400}
          sizes="100vw"
        />

        <ProductsList title="Novos Produtos" products={newlyCreatedProducts} />
      </div>

      <div className="mt-14">
        <Footer />
      </div>
    </>
  );
}
