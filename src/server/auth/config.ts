import { PrismaAdapter } from "@auth/prisma-adapter";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { db } from "~/server/db";
import type { User as PrismaUser } from "@prisma/client"; // ✅ Correct import for PrismaUser

/**
 * Module augmentation for `next-auth` types.
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			name: string | null;
			email: string | null;
		} & DefaultSession["user"];
	}

	interface User {
		name?: string | null;
		email?: string | null;
		password?: string | null; // Only available server-side
	}
}

/**
 * NextAuth configuration
 */
export const authConfig: NextAuthConfig = {
	providers: [
		DiscordProvider,
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(
				credentials: any // TODO: Later better type for this
			): Promise<Omit<PrismaUser, "password"> | null> {
				// Check if credentials are available and valid
				if (!credentials?.email || !credentials?.password) return null;

				// Fetch user from the database using email
				const user = await db.user.findUnique({
					where: { email: credentials.email },
				});

				// If no user or password is missing, return null
				if (!user || !user.password) return null;

				// Validate password using bcrypt
				const isPasswordValid = await bcrypt.compare(
					credentials.password,
					user.password
				);

				// If password is invalid, return null
				if (!isPasswordValid) return null;

				// Exclude password from the returned user object
				const { password, ...userWithoutPassword } = user;
				return userWithoutPassword;
			},
		}),
	],
	adapter: PrismaAdapter(db),
	callbacks: {
		async session({ session, user }) {
			if (session.user) {
				// Add user ID to the session object
				session.user.id = user.id;
			}
			return session;
		},
	},
};
