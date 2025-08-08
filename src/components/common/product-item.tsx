import Image from "next/image";
import Link from "next/link";

import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";
import { cn } from "@/lib/utils";

interface ProductItemProps {
  product: typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  };
  textContainerClassName?: string;
}

const ProductItem = ({ product, textContainerClassName }: ProductItemProps) => {
  const firstVariant = product.variants[0];
  return (
    <Link href={firstVariant ? `/product-variant/${firstVariant.slug}` : "#"} className="flex flex-col gap-4">
      {firstVariant ? (
        <Image
          src={firstVariant.imageUrl}
          alt={firstVariant.name}
          sizes="100vw"
          height={0}
          width={0}
          className="h-auto w-full rounded-3xl"
        />
      ) : (
        <div className="flex h-[200px] w-[200px] items-center justify-center rounded-3xl bg-gray-200">
          <span className="text-sm text-gray-400">No image</span>
        </div>
      )}
      <div
        className={cn(
          "flex max-w-[200px] flex-col gap-1",
          textContainerClassName,
        )}
      >
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="text-muted-foreground truncate text-xs font-medium">
          {product.description}
        </p>
        <p className="truncate text-sm font-semibold">
          {firstVariant ? formatCentsToBRL(firstVariant.priceInCents) : "N/A"}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
