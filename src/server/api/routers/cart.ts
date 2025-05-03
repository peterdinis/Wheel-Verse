import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const cartRouter = createTRPCRouter({
	addToCart: protectedProcedure
		.input(
			z.object({
				productId: z.string().min(1, "Product ID is required"),
				quantity: z.number().min(1, "Quantity must be at least 1").optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			try {
				const product = await db.product.findUnique({
					where: { id: input.productId },
				});
				if (!product) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Product not found",
					});
				}

				const existingCart = await db.cart.findFirst({
					where: {
						userId,
						productId: input.productId,
					},
				});

				if (existingCart) {
					return db.cart.update({
						where: { id: existingCart.id },
						data: {
							quantity: {
								increment: input.quantity ?? 1,
							},
						},
					});
				}

				return db.cart.create({
					data: {
						userId,
						productId: input.productId,
						quantity: input.quantity ?? 1,
					},
				});
			} catch (err) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to add to cart",
					cause: err,
				});
			}
		}),

	deleteFromCart: protectedProcedure
		.input(
			z.object({
				productId: z.string().min(1, "Product ID is required"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			try {
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
			} catch (err) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete from cart",
					cause: err,
				});
			}
		}),

	incrementQuantity: protectedProcedure
		.input(
			z.object({
				productId: z.string().min(1, "Product ID is required"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			try {
				const cartItem = await db.cart.findFirst({
					where: { userId, productId: input.productId },
				});

				if (!cartItem) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Cart item not found",
					});
				}

				return db.cart.update({
					where: { id: cartItem.id },
					data: {
						quantity: { increment: 1 },
					},
				});
			} catch (err) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to increment quantity",
					cause: err,
				});
			}
		}),

	decrementQuantity: protectedProcedure
		.input(
			z.object({
				productId: z.string().min(1, "Product ID is required"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			try {
				const cartItem = await db.cart.findFirst({
					where: { userId, productId: input.productId },
				});

				if (!cartItem) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Cart item not found",
					});
				}

				if (cartItem.quantity <= 1) {
					return db.cart.delete({
						where: { id: cartItem.id },
					});
				}

				return db.cart.update({
					where: { id: cartItem.id },
					data: {
						quantity: { decrement: 1 },
					},
				});
			} catch (err) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to decrement quantity",
					cause: err,
				});
			}
		}),
});
