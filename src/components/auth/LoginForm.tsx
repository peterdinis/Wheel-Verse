"use client";

import { motion } from "framer-motion";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { type FC } from "react";
import { useForm } from "react-hook-form"; // Import react-hook-form
import { signIn } from "next-auth/react"; // For logging in with NextAuth
import { useToast } from "~/hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Define the form data types
interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: FC = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormData>();
  const { toast } = useToast();
  
  const onSubmit = async (data: LoginFormData) => {
    const { email, password } = data;

    try {
      // Use NextAuth.js Credentials Provider to log in
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast({
          title: "Login failed",
          description: res.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login successful!",
          description: "Welcome back!",
		  className: "bg-green-800 text-white font-bold text-xl"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
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
            <LockKeyhole className="h-8 w-8 text-primary" />
          </motion.div>
          <h1 className="mt-4 font-bold text-2xl tracking-tight">Login</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Log in to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email address
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email", { 
                    required: "Email is required", 
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Invalid email address",
                    }
                  })}
                  className="mt-1"
                />
                {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <Label htmlFor="password" className="flex items-center gap-2">
                <LockKeyhole className="h-4 w-4" /> Password
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password", { 
                    required: "Password is required" 
                  })}
                  className="mt-1"
                />
                {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="text-sm">
              <Link
                href="/register"
                className="font-medium text-primary hover:text-primary/80"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              <Loader2 className="h-8 w-8 animate-spin" />
              Login
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginForm;
