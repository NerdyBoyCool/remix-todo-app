import AppError from '~/appError';
import { db } from '~/utils/db.server';

export const getUserRecord = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('UserNotFound', 'user is not found');
  }

  return user;
};
