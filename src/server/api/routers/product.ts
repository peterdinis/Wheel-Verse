import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const productRouter = createTRPCRouter({
	create: publicProcedure
		.input(
			z.object({
				name: z.string(),
				slug: z.string().optional(),
				description: z.string().optional(),
				price: z.number(),
				discount: z.number().optional(),
				stock: z.number().optional(),
				sku: z.string().optional(),
				imageUrl: z.string().optional(),
				isAvaiable: z.boolean().optional(),
				rating: z.number().optional(),
				categoryId: z.string().optional(),
				brand: z.string().optional(),
				color: z.string().optional(),
				weight: z.number().optional(),
				dimensions: z.any().optional(), // pre JSON
			}),
		)
		.mutation(async ({ input }) => {
			return db.product.create({ data: input });
		}),

	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input }) => {
			return db.product.findUnique({
				where: { id: input.id },
				include: {
					reviews: true,
					category: true,
				},
			});
		}),

	update: publicProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().optional(),
				slug: z.string().optional(),
				description: z.string().optional(),
				price: z.number().optional(),
				discount: z.number().optional(),
				stock: z.number().optional(),
				sku: z.string().optional(),
				imageUrl: z.string().optional(),
				isAvaiable: z.boolean().optional(),
				rating: z.number().optional(),
				categoryId: z.string().optional(),
				brand: z.string().optional(),
				color: z.string().optional(),
				weight: z.number().optional(),
				dimensions: z.any().optional(),
			}),
		)
		.mutation(async ({ input }) => {
			const { id, ...data } = input;
			return db.product.update({
				where: { id },
				data,
			});
		}),

	delete: publicProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input }) => {
			return db.product.delete({
				where: { id: input.id },
			});
		}),

	list: publicProcedure
		.input(
			z.object({
				search: z.string().optional(),
				minPrice: z.number().optional(),
				maxPrice: z.number().optional(),
				categoryId: z.string().optional(),
				page: z.number().min(1).default(1),
				limit: z.number().min(1).max(100).default(10),
			}),
		)
		.query(async ({ input }) => {
			const { search, minPrice, maxPrice, categoryId, page, limit } = input;

			const where: Prisma.ProductWhereInput = {
				AND: [
					search ? { name: { contains: search, mode: "insensitive" } } : undefined,
					minPrice !== undefined ? { price: { gte: minPrice } } : undefined,
					maxPrice !== undefined ? { price: { lte: maxPrice } } : undefined,
					categoryId ? { categoryId } : undefined,
				].filter(Boolean) as Prisma.ProductWhereInput[],
			};

			const [products, total] = await Promise.all([
				db.product.findMany({
					where,
					skip: (page - 1) * limit,
					take: limit,
					orderBy: { createdAt: "desc" },
					include: {
						category: true,
						reviews: true,
					},
				}),
				db.product.count({ where }),
			]);

			return {
				products,
				total,
				totalPages: Math.ceil(total / limit),
				currentPage: page,
			};
		}),
});
