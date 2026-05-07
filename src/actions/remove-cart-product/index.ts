"use server";

import { eq } from "drizzle-orm";
import z from "zod";

import { db } from "@/db";
import { cartItemTable } from "@/db/schema";
import { getCurrentUserId } from "@/lib/local-auth";

import { removeProductFromCartSchema } from "./schema";

export const removeProductFromCart = async (
  data: z.infer<typeof removeProductFromCartSchema>,
) => {
  removeProductFromCartSchema.parse(data);
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, data.cartItemId),
    with: {
      cart: true,
    },
  });
  if (!cartItem) {
    throw new Error("Cart item not found");
  }
  const cartDoesNotBelongToUser = cartItem.cart.userId !== userId;
  if (cartDoesNotBelongToUser) {
    throw new Error("Unauthorized");
  }
  await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
};
