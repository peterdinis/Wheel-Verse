"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "~/hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"; 


const loginFormSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});

type LoginFormData = z.infer<typeof loginFormSchema>; 
const LoginForm: FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema), 
  });

  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    const { email, password } = data;

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        if (res.error.includes("CredentialsSignin")) {
          toast({
            title: "Login failed",
            description: "Invalid credentials, please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login failed",
            description: res.error,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Login successful!",
          description: "Welcome back!",
          className: "bg-green-800 text-white font-bold text-xl",
        });
        router.push("/profile");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-6 flex items-center justify-center">
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
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Password Input with toggle */}
            <div>
              <Label htmlFor="password" className="flex items-center gap-2">
                <LockKeyhole className="h-4 w-4" /> Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground transition hover:text-primary"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-red-600 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              Don't have an account? Sign up
            </Link>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full text-black dark:text-white"
              disabled={isSubmitting} 
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginForm;
