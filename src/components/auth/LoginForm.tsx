"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
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
	const [showPassword, setShowPassword] = useState(false);
	const [success, setSuccess] = useState(false);
	const registerMutation = api.user.register.useMutation();

	const form = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: RegisterInput) => {
		try {
			await registerMutation.mutateAsync(data);
			setSuccess(true);
			form.reset();
		} catch (err: any) {
			form.setError("email", {
				message: err?.message || "Registration error",
			});
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
									<FormControl>
										<div className="relative">
											<Input
												id="password"
												type={showPassword ? "text" : "password"}
												placeholder="••••••"
												{...field}
											/>
											<button
												type="button"
												onClick={() => setShowPassword((prev) => !prev)}
												className="absolute right-3 top-2.5 text-muted-foreground"
											>
												{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
											</button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full">
							Register
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
