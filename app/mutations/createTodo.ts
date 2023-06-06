import type { Todo } from '@prisma/client';
import { db } from '~/utils/db.server';

export const createUser = async (data: Todo) => {
  const todo = await db.todo.create({ data });
  if (!todo) {
    throw new Error('Unexpected Error');
  }

  return todo;
};
