"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { AddProductToCartSchema, addProductToCartSchema } from "./schema";

export const addProductToCart = async (data: AddProductToCartSchema) => {
    // Valida os dados de entrada
    addProductToCartSchema.parse(data);

    // Obtém a sessão do usuário
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    // Verifica se o produto existe
    const productVariant = await db.query.productVariantTable.findFirst({
        where: (productVariant, { eq }) =>
            eq(productVariant.id, data.productVariantId),
    });
    if (!productVariant) {
        throw new Error("Product variant not found");
    }

    // Busca carrinho existente
    let cart = await db.query.cartTable.findFirst({
        where: (cart, { eq }) => eq(cart.userId, session.user.id),
    });

    // Cria carrinho se não existir
    if (!cart) {
        const [newCart] = await db
            .insert(cartTable)
            .values({ userId: session.user.id })
            .returning();

        if (!newCart) {
            throw new Error("Failed to create cart");
        }

        cart = newCart;
    }

    const cartId = cart.id;

    // Busca item no carrinho
    const cartItem = await db.query.cartItemTable.findFirst({
        where: (cartItem, { eq }) =>
            eq(cartItem.cartId, cartId) &&
            eq(cartItem.productVariantId, data.productVariantId),
    });

    // Atualiza quantidade se já existir
    if (cartItem) {
        await db
            .update(cartItemTable)
            .set({
                quantity: cartItem.quantity + data.quantity,
            })
            .where(eq(cartItemTable.id, cartItem.id));
        return;
    }

    // Adiciona novo item
    await db.insert(cartItemTable).values({
        cartId,
        productVariantId: data.productVariantId,
        quantity: data.quantity,
    });
};
