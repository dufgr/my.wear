"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { getCurrentUserId } from "@/lib/local-auth";

export async function getUserAddresses() {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  try {
    const addresses = await db
      .select()
      .from(shippingAddressTable)
      .where(eq(shippingAddressTable.userId, userId))
      .orderBy(shippingAddressTable.createdAt);

    return addresses;
  } catch (error) {
    console.error("Erro ao buscar endereços:", error);
    throw new Error("Erro ao buscar endereços");
  }
}
