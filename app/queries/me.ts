import AppError from '~/appError';
import { db } from '~/utils/db.server';

export const me = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      todos: {
        select: {
          title: true,
          content: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('UserNotFound', 'user is not found');
  }

  return user;
};
