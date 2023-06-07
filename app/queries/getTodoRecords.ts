import { db } from '~/utils/db.server';

export const getTodoRecords = async () => {
  return await db.todo.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, content: true },
    take: 2,
  });
};
