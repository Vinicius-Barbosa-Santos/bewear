import Image from "next/image";
import Link from "next/link";

import { productVariantTable } from "@/db/schema";

interface VariantSelectorProps {
    selectedVariantSlug: string;
    variants: (typeof productVariantTable.$inferSelect)[];
}

const VariantSelector = ({
    selectedVariantSlug,
    variants,
}: VariantSelectorProps) => {
    return (
        <div>
            <h3 className="mb-2 font-medium">Cores</h3>
            <div className="flex items-center gap-4">
                {variants.map((variant) => (
                    <Link
                        href={`/product-variant/${variant.slug}`}
                        key={variant.id}
                        className={
                            selectedVariantSlug === variant.slug
                                ? "border-primary rounded-xl border-2 p-0.5"
                                : "border border-gray-200 rounded-xl p-0.5"
                        }
                    >
                        <Image
                            width={60}
                            height={60}
                            src={variant.imageUrl}
                            alt={variant.name}
                            className="rounded-lg"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default VariantSelector;