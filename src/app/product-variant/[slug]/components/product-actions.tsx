"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface ProductActionsProps {
    productVariantId: string;
}

const ProductActions = ({ productVariantId }: ProductActionsProps) => {
    const [quantity, setQuantity] = useState(1);

    const handleDecrement = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const handleIncrement = () => {
        setQuantity((prev) => prev + 1);
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="mb-2 font-medium">Quantidade</h3>
                <div className="flex w-[120px] items-center justify-between rounded-lg border">
                    <Button size="icon" variant="ghost" onClick={handleDecrement}>
                        <MinusIcon className="h-4 w-4" />
                    </Button>
                    <p>{quantity}</p>
                    <Button size="icon" variant="ghost" onClick={handleIncrement}>
                        <PlusIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                <Button variant="outline" className="rounded-full" size="lg">
                    Adicionar à sacola
                </Button>
                <Button className="rounded-full" size="lg">
                    Comprar agora
                </Button>
            </div>
        </div>
    );
};

export default ProductActions;