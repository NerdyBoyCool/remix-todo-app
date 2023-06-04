import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const todos = async () => {
  return json({
    todos: await db.todo.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, content: true },
      take: 2
    })
  })
}
