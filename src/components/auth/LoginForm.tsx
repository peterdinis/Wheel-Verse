"use client"

import { type FC, useState, type FormEvent } from "react";
import { useToast } from "~/hooks/use-toast";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, UserPlus, Loader2, User, LockKeyhole } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {Switch} from "../ui/switch"

const LoginForm: FC = () => {
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
        <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <motion.div 
          className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-lg border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center"
            >
              <UserPlus className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight">Create an account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
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
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
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
                  I accept the <a href="#" className="text-primary hover:underline">terms and conditions</a>
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
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin w-8 h-8" /> : "Register"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    )
}

export default LoginForm