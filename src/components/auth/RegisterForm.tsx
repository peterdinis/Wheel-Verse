"use client";

import { motion } from "framer-motion";
import { Loader2, LockKeyhole, Mail, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { type FC, type FormEvent, useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

const RegisterForm: FC = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleRegister = (e: FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast({
				title: "Passwords don't match",
				description: "Please ensure both passwords are identical.",
				variant: "destructive",
			});
			return;
		}

		if (!acceptTerms) {
			toast({
				title: "Terms not accepted",
				description: "You must accept the terms and conditions to register.",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);
	};

	return (
		<div className="container flex min-h-[calc(100vh-12rem)] items-center justify-center">
			<motion.div
				className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-lg"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="text-center">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2, type: "spring" }}
						className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
					>
						<UserPlus className="h-8 w-8 text-primary" />
					</motion.div>
					<h1 className="mt-4 font-bold text-2xl tracking-tight">
						Create an account
					</h1>
					<p className="mt-2 text-muted-foreground text-sm">
						Sign up to start shopping our premium bike collection
					</p>
				</div>

				<form onSubmit={handleRegister} className="mt-8 space-y-6">
					<div className="space-y-4">
						<div>
							<Label htmlFor="name" className="flex items-center gap-2">
								<User className="h-4 w-4" /> Full Name
							</Label>
							<div className="mt-1">
								<Input
									id="name"
									name="name"
									type="text"
									autoComplete="name"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="mt-1"
								/>
							</div>
						</div>

						<div>
							<Label htmlFor="email" className="flex items-center gap-2">
								<Mail className="h-4 w-4" /> Email address
							</Label>
							<div className="mt-1">
								<Input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="mt-1"
								/>
							</div>
						</div>

						<div>
							<Label htmlFor="password" className="flex items-center gap-2">
								<LockKeyhole className="h-4 w-4" /> Password
							</Label>
							<div className="mt-1">
								<Input
									id="password"
									name="password"
									type="password"
									autoComplete="new-password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="mt-1"
								/>
							</div>
						</div>

						<div>
							<Label
								htmlFor="confirmPassword"
								className="flex items-center gap-2"
							>
								<LockKeyhole className="h-4 w-4" /> Confirm Password
							</Label>
							<div className="mt-1">
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									autoComplete="new-password"
									required
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="mt-1"
								/>
							</div>
						</div>

						<div className="flex items-center space-x-2">
							<Switch
								id="terms"
								checked={acceptTerms}
								onCheckedChange={setAcceptTerms}
							/>
							<Label htmlFor="terms">
								I accept the{" "}
								<a href="#" className="text-primary hover:underline">
									terms and conditions
								</a>
							</Label>
						</div>
					</div>

					<div className="flex items-center">
						<div className="text-sm">
							<Link
								href="/login"
								className="font-medium text-primary hover:text-primary/80"
							>
								Already have an account? Login
							</Link>
						</div>
					</div>

					<div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? (
								<Loader2 className="h-8 w-8 animate-spin" />
							) : (
								"Register"
							)}
						</Button>
					</div>
				</form>
			</motion.div>
		</div>
	);
};

export default RegisterForm;
