import { json } from '@remix-run/node';
import { db } from '~/utils/db.server';

export const todo = async (todoId: string) => {
  const todo = await db.todo.findUnique({
    where: { id: todoId },
  });

  if (!todo) {
    throw new Error('Todo is not found');
  }

  return json({ todo });
};
