import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { userTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { isLocalAuthBypassEnabled } from "./local-auth-config";

export const getCurrentUserId = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    return session.user.id;
  }

  if (!isLocalAuthBypassEnabled) {
    return null;
  }

  const localUserId = "local-bypass-user";
  await db
    .insert(userTable)
    .values({
      id: localUserId,
      name: "Local Developer",
      email: "local-bypass@mywear.test",
    })
    .onConflictDoNothing();

  const [localUser] = await db
    .select({ id: userTable.id })
    .from(userTable)
    .where(eq(userTable.id, localUserId))
    .limit(1);

  return localUser?.id ?? null;
};
