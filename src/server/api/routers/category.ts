import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
	// Create a new category
	create: publicProcedure
		.input(
			z.object({
				name: z.string().min(1, "Name is required"),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ input }) => {
			return db.category.create({
				data: input,
			});
		}),

	// Get a single category by ID
	getById: publicProcedure
		.input(
			z.object({
				id: z.string(),
				includeProducts: z.boolean().optional().default(true),
			}),
		)
		.query(async ({ input }) => {
			return db.category.findUnique({
				where: { id: input.id },
				include: {
					products: input.includeProducts,
				},
			});
		}),

	// Update a category
	update: publicProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().optional(),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ input }) => {
			const { id, ...data } = input;

			return db.category.update({
				where: { id },
				data,
			});
		}),

	// Delete a category
	delete: publicProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input }) => {
			return db.category.delete({
				where: { id: input.id },
			});
		}),

	// List categories with optional search & pagination
	list: publicProcedure
		.input(
			z.object({
				search: z.string().optional(),
				page: z.number().min(1).default(1),
				limit: z.number().min(1).max(100).default(10),
				includeProducts: z.boolean().optional().default(false),
			}),
		)
		.query(async ({ input }) => {
			const { search, page, limit, includeProducts } = input;

			const where = search
				? { name: { contains: search, mode: "insensitive" } }
				: {};

			const [categories, total] = await Promise.all([
				db.category.findMany({
					where,
					skip: (page - 1) * limit,
					take: limit,
					orderBy: { createdAt: "desc" },
					include: {
						products: includeProducts,
					},
				}),
				db.category.count({ where }),
			]);

			return {
				categories,
				total,
				totalPages: Math.ceil(total / limit),
				currentPage: page,
			};
		}),
});
