import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Starting seeding process...");

	try {
		// Seed Categories
		const categories = await Promise.all(
			Array.from({ length: 5 }).map(() =>
				prisma.category.create({
					data: {
						name:
							faker.commerce.department() +
							"-" +
							faker.string.uuid().slice(0, 5),
						description: faker.lorem.sentence(),
					},
				}),
			),
		);
		console.log(`✅ Seeded ${categories.length} categories.`);

		// Seed Users
		const users = await Promise.all(
			Array.from({ length: 5 }).map(async () => {
				const plainPassword = faker.internet.password();
				const hashedPassword = await bcrypt.hash(plainPassword, 10);

				return prisma.user.create({
					data: {
						name: faker.person.fullName(),
						email: faker.internet.email(),
						image: faker.image.avatar(),
						emailVerified: faker.date.past(),
						password: hashedPassword,
					},
				});
			}),
		);
		console.log(`✅ Seeded ${users.length} users.`);

		// Seed Products
		const products = await Promise.all(
			Array.from({ length: 20 }).map(() => {
				const category = faker.helpers.arrayElement(categories);
				const name = faker.commerce.productName();
				return prisma.product.create({
					data: {
						name,
						slug: faker.helpers.slugify(name.toLowerCase()),
						description: faker.commerce.productDescription(),
						price: Number.parseFloat(
							faker.commerce.price({ min: 10, max: 1000 }),
						),
						discount: faker.number.float({ min: 0, max: 30 }),
						stock: faker.number.int({ min: 0, max: 100 }),
						sku: faker.string.alphanumeric({ length: 8, casing: "upper" }),
						imageUrl: faker.image.urlLoremFlickr({ category: "product" }),
						isAvaiable: faker.datatype.boolean(),
						rating: faker.number.int({ min: 1, max: 5 }),
						categoryId: category.id,
						brand: faker.company.name(),
						color: faker.color.human(),
						weight: faker.number.float({ min: 0.1, max: 5 }),
						dimensions: {
							length: faker.number.int({ min: 10, max: 100 }),
							width: faker.number.int({ min: 10, max: 100 }),
							height: faker.number.int({ min: 10, max: 100 }),
						},
					},
				});
			}),
		);
		console.log(`✅ Seeded ${products.length} products.`);

		// Seed Reviews
		const reviews = await Promise.all(
			Array.from({ length: 30 }).map(() => {
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
			}),
		);
		console.log(`✅ Seeded ${reviews.length} reviews.`);

		// Seed Carts
		const carts = await Promise.all(
			Array.from({ length: 15 }).map(() => {
				const user = faker.helpers.arrayElement(users);
				const product = faker.helpers.arrayElement(products);
				return prisma.cart.create({
					data: {
						userId: user.id,
						productId: product.id,
						quantity: faker.number.int({ min: 1, max: 5 }),
					},
				});
			}),
		);
		console.log(`✅ Seeded ${carts.length} cart items.`);

		console.log("🎉 Seeding complete!");
	} catch (error) {
		console.error("❌ Seeding failed:", error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

main();
