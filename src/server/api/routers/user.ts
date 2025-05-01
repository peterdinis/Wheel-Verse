import bcrypt from 'bcrypt';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { db } from '~/server/db'; // make sure this points to your actual Prisma instance

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Meno je povinné'),
        email: z.string().email('Neplatný email'),
        password: z.string().min(6, 'Heslo musí mať aspoň 6 znakov'),
      })
    )
    .mutation(async ({ input }) => {
      const { name, email, password } = input;

      // Check if user already exists
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) {
        throw new Error('Používateľ s týmto emailom už existuje.');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const user = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return { id: user.id, name: user.name, email: user.email };
    }),
});
