import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "~/server/db";

export const categoryRouter = createTRPCRouter({
  // Create a new category
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return db.category.create({
        data: input,
      });
    }),

  // Get a single category by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return db.category.findUnique({
        where: { id: input.id },
        include: {
          products: true,
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return db.category.update({
        where: { id },
        data,
      });
    }),

  // Delete a category
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return db.category.delete({
        where: { id: input.id },
      });
    }),

  // List categories (with search + pagination)
  list: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, page, limit } = input;

      const where = {
        name: search
          ? { contains: search, mode: "insensitive" }
          : undefined,
      };

      const [categories, total] = await Promise.all([
        db.category.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            products: true,
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
