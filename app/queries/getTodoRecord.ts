import { db } from '~/utils/db.server';

export const getTodoRecord = async (todoId: string) => {
  const todo = await db.todo.findUnique({
    where: { id: todoId },
  });

  if (!todo) {
    throw new Error('Todo is not found');
  }

  return todo;
};
