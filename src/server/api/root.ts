import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { adminRouter } from "./routers/admin";
import { cartRouter } from "./routers/cart";
import { paymentRouter } from "./routers/payment";
import { productRouter } from "./routers/product";
import { userRouter } from "./routers/user";
import { categoryRouter } from "./routers/category";

export const appRouter = createTRPCRouter({
	admin: adminRouter,
	cart: cartRouter,
	product: productRouter,
	user: userRouter,
	category: categoryRouter,
	payment: paymentRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
