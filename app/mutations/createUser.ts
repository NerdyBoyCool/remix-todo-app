import type { User } from "@prisma/client";
import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const createUser = async (data: User) => {
  const user = await db.user.create({ data })
  if (!user) {
    throw new Error('Unexpected Error')
  }

  return json({ user })
}
