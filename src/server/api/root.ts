import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { adminRouter } from "./routers/admin";
import { cartRouter } from "./routers/cart";
import { categoryRouter } from "./routers/category";
import { paymentRouter } from "./routers/payment";
import { productRouter } from "./routers/product";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
	admin: adminRouter,
	cart: cartRouter,
	category: categoryRouter,
	product: productRouter,
	user: userRouter,
	payment: paymentRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
