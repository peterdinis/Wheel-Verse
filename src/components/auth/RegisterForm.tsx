"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
	name: z.string().min(1, "Meno je povinné"),
	email: z.string().email("Neplatný email"),
	password: z.string().min(6, "Heslo musí mať aspoň 6 znakov"),
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
	const registerMutation = api.user.register.useMutation();

	const onSubmit = async (data: RegisterInput) => {
		try {
			await registerMutation.mutateAsync(data);
			setSuccess(true);
			form.reset();
		} catch (err: any) {
			form.setError("email", {
				message: err?.message || "Chyba pri registrácii.",
			});
		}
	};

	return (
		<Card className="mx-auto mt-10 max-w-md rounded-2xl shadow-lg">
			<CardHeader>
				<CardTitle className="text-xl">Registrácia</CardTitle>
			</CardHeader>
			<CardContent>
				{success && (
					<div className="mb-4 font-medium text-green-600">
						Úspešne zaregistrovaný!
					</div>
				)}
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<Label htmlFor="name">Meno</Label>
									<FormControl>
										<Input id="name" placeholder="Zadaj meno" {...field} />
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
											placeholder="napr. janko@mail.sk"
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
									<Label htmlFor="password">Heslo</Label>
									<FormControl>
										<Input
											id="password"
											type="password"
											placeholder="••••••"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full">
							Registrovať
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
