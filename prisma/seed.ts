// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Seed Categories
  const categories = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.category.create({
        data: {
          name: faker.commerce.department() + '-' + faker.string.uuid().slice(0, 5),
          description: faker.lorem.sentence(),
        },
      })
    )
  );

  // Seed Users
  const users = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          image: faker.image.avatar(),
          emailVerified: faker.date.past(),
        },
      })
    )
  );

  // Seed Products
  const products = await Promise.all(
    Array.from({ length: 10 }).map(() => {
      const category = faker.helpers.arrayElement(categories);
      return prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
          imageUrl: faker.image.url(),
          categoryId: category.id,
        },
      });
    })
  );

  // Seed Reviews
  await Promise.all(
    Array.from({ length: 20 }).map(() => {
      const user = faker.helpers.arrayElement(users);
      const product = faker.helpers.arrayElement(products);
      return prisma.review.create({
        data: {
          content: faker.lorem.sentences(2),
          rating: faker.number.int({ min: 1, max: 5 }),
          userId: user.id,
          productId: product.id,
        },
      });
    })
  );

  // Seed Carts
  await Promise.all(
    Array.from({ length: 10 }).map(() => {
      const user = faker.helpers.arrayElement(users);
      const product = faker.helpers.arrayElement(products);
      return prisma.cart.create({
        data: {
          userId: user.id,
          productId: product.id,
          quantity: faker.number.int({ min: 1, max: 5 }),
        },
      });
    })
  );

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
