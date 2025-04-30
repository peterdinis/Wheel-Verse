import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";

export const cartRouter = createTRPCRouter({
  addToCart: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if cart entry already exists
      const existingCart = await db.cart.findFirst({
        where: {
          userId,
          productId: input.productId,
        },
      });

      if (existingCart) {
        // Increment quantity
        return db.cart.update({
          where: { id: existingCart.id },
          data: {
            quantity: {
              increment: input.quantity ?? 1,
            },
          },
        });
      }

      // Add new entry to cart
      return db.cart.create({
        data: {
          userId,
          productId: input.productId,
          quantity: input.quantity ?? 1,
        },
      });
    }),

  deleteFromCart: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existingCart = await db.cart.findFirst({
        where: {
          userId,
          productId: input.productId,
        },
      });

      if (!existingCart) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart item not found",
        });
      }

      return db.cart.delete({
        where: { id: existingCart.id },
      });
    }),
});