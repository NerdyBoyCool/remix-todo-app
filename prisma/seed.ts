import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function seed() {
  await Promise.all(
    todos().map((todo) => {
      return db.todo.create({
        data: todo,
      });
    })
  );
}

seed();

function todos() {
  return [
    {
      title: 'Prisma のコマンドを整理する',
      content: 'チュートリアルをやる',
    },
    {
      title: 'Remix で認証方式を決める',
      content: 'web文献を漁る',
    },
  ];
}
