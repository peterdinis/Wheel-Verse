"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const registerSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterInput = z.infer<typeof registerSchema>;

export function RegisterForm() {
	const form = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const [success, setSuccess] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const registerMutation = api.user.register.useMutation();

	const onSubmit = async (data: RegisterInput) => {
		setFormError(null);
		setSuccess(false);

		try {
			await registerMutation.mutateAsync(data);
			setSuccess(true);
			form.reset();
		} catch (err: any) {
			const message = err?.message || "Something went wrong during registration.";

			// Try to extract field-level errors
			if (err?.fieldErrors) {
				Object.entries(err.fieldErrors).forEach(([key, value]) => {
					form.setError(key as keyof RegisterInput, {
						message: Array.isArray(value) ? value[0] : value,
					});
				});
			} else {
				setFormError(message);
			}
		}
	};

	return (
		<Card className="mx-auto mt-10 max-w-md rounded-2xl shadow-lg">
			<CardHeader>
				<CardTitle className="text-xl">Register</CardTitle>
			</CardHeader>
			<CardContent>
				{success && (
					<div className="mb-4 font-medium text-green-600">
						Successfully registered!
					</div>
				)}

				{formError && (
					<div className="mb-4 font-medium text-red-600">{formError}</div>
				)}

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<Label htmlFor="name">Name</Label>
									<FormControl>
										<Input id="name" placeholder="Enter your name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<Label htmlFor="email">Email</Label>
									<FormControl>
										<Input
											id="email"
											placeholder="e.g. john@example.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<Label htmlFor="password">Password</Label>
									<div className="relative">
										<FormControl>
											<Input
												id="password"
												type={showPassword ? "text" : "password"}
												placeholder="••••••"
												{...field}
											/>
										</FormControl>
										<button
											type="button"
											className="-translate-y-1/2 absolute top-1/2 right-3 text-gray-500"
											onClick={() => setShowPassword((prev) => !prev)}
										>
											{showPassword ? (
												<EyeOff className="h-5 w-5" />
											) : (
												<Eye className="h-5 w-5" />
											)}
										</button>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="w-full text-black dark:text-white"
							disabled={registerMutation.isPending}
						>
							{registerMutation.isPending ? 
							<Loader2 className="animate-spin w-8 h-8" /> : "Register"}
						</Button>

						<Link href="/login" className="text-sky-600">
							Already have an account? Login here
						</Link>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
