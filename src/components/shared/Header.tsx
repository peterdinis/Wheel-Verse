"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { type FC, useState } from "react";
import { Button } from "../ui/button";
import { ModeToggle } from "./ModeToggle";

const Header: FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
	const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

	return (
		<header className="fixed top-0 right-0 left-0 z-50 border-b dark:bg-stone-800/50 bg-white/80 backdrop-blur-md">
			<div className="container mx-auto flex items-center justify-between px-4 py-3">
				<Link href="/" className="font-bold text-2xl text-primary">
					<motion.div
						whileHover={{ scale: 1.05 }}
						className="flex items-center"
					>
						<span className="mr-1 text-3xl">🚲</span>
						WheelVerse
					</motion.div>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden items-center space-x-6 md:flex">
					<Link
						href="/"
						className="font-medium transition-colors hover:text-primary"
					>
						Home
					</Link>
					<Link
						href="/products"
						className="font-medium transition-colors hover:text-primary"
					>
						Products
					</Link>
					<Link
						href="/categories"
						className="font-medium transition-colors hover:text-primary"
					>
						Categories
					</Link>
					<Link
						href="/about"
						className="font-medium transition-colors hover:text-primary"
					>
						About
					</Link>
				</nav>

				{/* Actions */}
				<div className="flex items-center space-x-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleSearch}
						aria-label="Search"
					>
						<Search className="h-5 w-5" />
					</Button>

					<Link href="/cart">
						<Button
							variant="ghost"
							size="icon"
							aria-label="Cart"
							className="relative"
						>
							<ShoppingCart className="h-5 w-5" />
							<span className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
								2
							</span>
						</Button>
					</Link>

					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={toggleMenu}
						aria-label="Menu"
					>
						{isMenuOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
					</Button>
					<ModeToggle />
				</div>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						className="absolute top-full right-0 left-0 border-b bg-white shadow-lg md:hidden"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						<nav className="flex flex-col space-y-4 p-4">
							<Link
								href="/"
								className="font-medium transition-colors hover:text-primary"
								onClick={() => setIsMenuOpen(false)}
							>
								Home
							</Link>
							<Link
								href="/products"
								className="font-medium transition-colors hover:text-primary"
								onClick={() => setIsMenuOpen(false)}
							>
								Products
							</Link>
							<Link
								href="/categories"
								className="font-medium transition-colors hover:text-primary"
								onClick={() => setIsMenuOpen(false)}
							>
								Categories
							</Link>
							<Link
								href="/about"
								className="font-medium transition-colors hover:text-primary"
								onClick={() => setIsMenuOpen(false)}
							>
								About
							</Link>
						</nav>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Search Bar */}
			<AnimatePresence>
				{isSearchOpen && (
					<motion.div
						className="absolute top-full right-0 left-0 border-b bg-white p-4 shadow-lg"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						<div className="relative mx-auto max-w-2xl">
							<input
								type="text"
								placeholder="Search for bikes..."
								className="w-full rounded-md border p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
								autoFocus
							/>
							<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
};

export default Header;
