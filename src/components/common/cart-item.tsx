import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-cart-product";
import { decreaseCartProductQuantity } from "@/actions/decrease-cart-product-quantity";
import { DecreaseCartProductQuantitySchema } from "@/actions/decrease-cart-product-quantity/schema";
import { removeProductFromCart } from "@/actions/remove-cart-product";
import { formatCentsToBRL } from "@/helpers/money";

import { Button } from "../ui/button";

interface CartItemType {
    id: string;
    productName: string;
    productVariantName: string;
    productVariantId: string;
    productVariantImageUrl: string;
    productVariantPriceInCents: number;
    quantity: number;
}

interface Cart {
    items: CartItemType[];
}

type CartItemProps = CartItemType;

const CartItem = ({
    id,
    productName,
    productVariantName,
    productVariantImageUrl,
    productVariantId,
    productVariantPriceInCents,
    quantity,
}: CartItemProps) => {
    const queryClient = useQueryClient();

    // Remover produto
    const removeProductFromCartMutation = useMutation({
        mutationKey: ["remove-cart-product"],
        mutationFn: () => removeProductFromCart({ cartItemId: id }),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["cart"] });
            const previousCart = queryClient.getQueryData<Cart>(["cart"]);

            queryClient.setQueryData<Cart>(["cart"], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    items: old.items.filter((item) => item.id !== id),
                };
            });

            return { previousCart };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData<Cart>(["cart"], context.previousCart);
            }
            toast.error("Erro ao remover produto", { id: "removeToast" });
        },
        onSuccess: () => {
            toast.success("Produto removido com sucesso", { id: "removeToast" });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });

    // Diminuir quantidade
    const decreaseCartProductQuantityMutation = useMutation({
        mutationKey: ["decrease-cart-product-quantity"],
        mutationFn: (data: DecreaseCartProductQuantitySchema) =>
            decreaseCartProductQuantity(data),
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: ["cart"] });
            const previousCart = queryClient.getQueryData<Cart>(["cart"]);

            queryClient.setQueryData<Cart>(["cart"], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    items: old.items.map((item) =>
                        item.id === data.cartItemId
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    ),
                };
            });

            return { previousCart };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData<Cart>(["cart"], context.previousCart);
            }
            toast.error("Erro ao decrementar quantidade", { id: "decreaseToast" });
        },
        onSuccess: () => {
            toast.success("Quantidade decrementada com sucesso", { id: "decreaseToast" });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });

    // Aumentar quantidade
    const increaseCartProductQuantityMutation = useMutation({
        mutationKey: ["increase-cart-product-quantity"],
        mutationFn: () => addProductToCart({ productVariantId, quantity: 1 }),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["cart"] });
            const previousCart = queryClient.getQueryData<Cart>(["cart"]);

            queryClient.setQueryData<Cart>(["cart"], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    items: old.items.map((item) =>
                        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                    ),
                };
            });

            return { previousCart };
        },
        onError: (_err, _variables, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData<Cart>(["cart"], context.previousCart);
            }
            toast.error("Erro ao incrementar quantidade", { id: "increaseToast" });
        },
        onSuccess: () => {
            toast.success("Quantidade incrementada com sucesso", { id: "increaseToast" });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });

    // Funções que disparam a mutação com toast loading e atualização do toast depois
    function handleRemove() {
        toast.loading("Removendo produto...", { id: "removeToast" });
        removeProductFromCartMutation.mutate(undefined);
    }

    function handleDecrease() {
        toast.loading("Diminuindo quantidade...", { id: "decreaseToast" });
        decreaseCartProductQuantityMutation.mutate({ cartItemId: id });
    }

    function handleIncrease() {
        toast.loading("Aumentando quantidade...", { id: "increaseToast" });
        increaseCartProductQuantityMutation.mutate(undefined);
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Image
                    src={productVariantImageUrl}
                    alt={productVariantName}
                    width={78}
                    height={78}
                    className="rounded-lg"
                />
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">{productName}</p>
                    <p className="text-muted-foreground text-xs font-medium">
                        {productVariantName}
                    </p>
                    <div className="flex w-[100px] items-center justify-between rounded-lg border p-1">
                        <Button
                            className="h-4 w-4"
                            variant="ghost"
                            onClick={() => {
                                if (quantity === 1) {
                                    handleRemove();
                                } else {
                                    handleDecrease();
                                }
                            }}
                        >
                            <MinusIcon />
                        </Button>
                        <p className="text-xs font-medium">{quantity}</p>
                        <Button
                            className="h-4 w-4"
                            variant="ghost"
                            onClick={() => handleIncrease()}
                        >
                            <PlusIcon />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end justify-center gap-2">
                <Button variant="outline" onClick={handleRemove} size="icon">
                    <TrashIcon />
                </Button>
                <p className="text-sm font-bold">
                    {formatCentsToBRL(productVariantPriceInCents)}
                </p>
            </div>
        </div>
    );
};

export default CartItem;
