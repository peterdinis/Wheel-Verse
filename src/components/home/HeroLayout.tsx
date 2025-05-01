"use client";

import { motion } from "framer-motion";
import { ChevronRight, ShieldCheck, Star, Truck } from "lucide-react";
import Link from "next/link";
import { type FC, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { BicycleModel } from "./BicycleModel";

const HeroLayout: FC = () => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoaded(true);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	const fadeInUp = {
		initial: { opacity: 0, y: 30 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.8, ease: "easeOut" },
	};

	const stagger = {
		animate: {
			transition: {
				staggerChildren: 0.2,
			},
		},
	};
	return (
		<div className="flex flex-col">
			{/* Hero Section with 3D Model */}
			<section className="flex min-h-screen flex-col items-center bg-gradient-to-b from-primary/5 to-background/50 md:flex-row dark:from-primary/10 dark:to-background">
				<div className="container mx-auto flex flex-col items-center px-4 py-16 md:flex-row md:py-24">
					{/* Left side content */}
					<motion.div
						className="mb-12 w-full text-center md:mb-0 md:w-1/2 md:text-left"
						variants={stagger}
						initial="initial"
						animate="animate"
					>
						<motion.span
							variants={fadeInUp}
							className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 font-medium text-primary text-sm transition-colors hover:bg-primary/20"
						>
							Premium Bike Collection
						</motion.span>

						<motion.h1
							variants={fadeInUp}
							className="mb-6 font-bold text-4xl leading-tight md:text-6xl"
						>
							Ride the <span className="text-primary">Future</span> with Our
							Premium Bikes
						</motion.h1>

						<motion.p
							variants={fadeInUp}
							className="mx-auto mb-8 max-w-lg text-lg text-muted-foreground md:mx-0"
						>
							Discover our collection of high-performance bicycles designed for
							every terrain. From mountain trails to city streets, find your
							perfect ride today.
						</motion.p>

						<motion.div
							variants={fadeInUp}
							className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start"
						>
							<Button
								size="lg"
								className="group text-black transition-all duration-300 hover:scale-105 dark:text-white"
								asChild
							>
								<Link href="/products">
									Shop Now
									<ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>

							<Button
								variant="outline"
								size="lg"
								className="transition-all duration-300 hover:scale-105"
								asChild
							>
								<Link href="/products">Explore Collection</Link>
							</Button>
						</motion.div>
					</motion.div>

					{/* Right side 3D model */}
					<motion.div
						className="relative h-[400px] w-full md:h-[600px] md:w-1/2"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
						transition={{ duration: 1, ease: "easeOut" }}
					>
						<div className="absolute inset-0">
							<BicycleModel autoRotate />
						</div>
					</motion.div>
				</div>
			</section>

			{/* Features Section */}
			<section className="bg-background py-16 md:py-24">
				<div className="container mx-auto px-4">
					<motion.div
						className="mb-16 text-center"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="mb-4 font-bold text-3xl md:text-4xl">
							Why Choose WheelVerse?
						</h2>
						<p className="mx-auto max-w-2xl text-gray-600 text-lg">
							We provide the best bicycling experience with our premium products
							and exceptional services.
						</p>
					</motion.div>

					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						{/* Feature 1 */}
						<motion.div
							className="rounded-xl bg-gray-50 p-8 text-center"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
								<Star className="h-8 w-8 text-primary" />
							</div>
							<h3 className="mb-4 font-semibold text-xl">Premium Quality</h3>
							<p className="text-gray-600">
								Our bikes are crafted with premium materials and cutting-edge
								technology for unmatched performance.
							</p>
						</motion.div>

						{/* Feature 2 */}
						<motion.div
							className="rounded-xl bg-gray-50 p-8 text-center"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
								<Truck className="h-8 w-8 text-primary" />
							</div>
							<h3 className="mb-4 font-semibold text-xl">Free Shipping</h3>
							<p className="text-gray-600">
								Enjoy free shipping on all orders across the country, with
								expert assembly upon delivery.
							</p>
						</motion.div>

						{/* Feature 3 */}
						<motion.div
							className="rounded-xl bg-gray-50 p-8 text-center"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.6 }}
						>
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
								<ShieldCheck className="h-8 w-8 text-primary" />
							</div>
							<h3 className="mb-4 font-semibold text-xl">10-Year Warranty</h3>
							<p className="text-gray-600">
								We stand behind our bikes with an industry-leading warranty and
								dedicated customer support.
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Featured Products */}
			<section className="bg-muted/50 py-16 md:py-24">
				<div className="container mx-auto px-4">
					<motion.div
						className="mb-12 flex flex-col items-center justify-between md:flex-row"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="font-bold text-3xl md:text-4xl">Featured Bikes</h2>
						<Button variant="link" asChild className="mt-4 md:mt-0">
							<Link href="/products">
								View All Bikes <ChevronRight className="ml-1 h-4 w-4" />
							</Link>
						</Button>
					</motion.div>

					<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
						{/* Featured Product 1 */}
						<motion.div
							className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							whileHover={{ y: -5 }}
						>
							<div className="flex h-64 items-center justify-center bg-blue-100 p-6">
								<span className="text-6xl">🚲</span>
							</div>
							<div className="p-6">
								<div className="mb-2 flex items-center justify-between">
									<span className="font-medium text-primary text-sm">
										Mountain Bike
									</span>
									<div className="flex items-center">
										<Star className="h-4 w-4 fill-current text-yellow-500" />
										<span className="ml-1 font-medium text-sm">4.9</span>
									</div>
								</div>
								<h3 className="mb-2 font-semibold text-xl">
									Alpine Explorer X7
								</h3>
								<p className="mb-4 text-gray-600 text-sm">
									Carbon frame, 29" wheels, premium suspension
								</p>
								<div className="flex items-center justify-between">
									<span className="font-bold text-2xl">$1,299</span>
									<Button size="sm" asChild>
										<Link href="/products/1">Details</Link>
									</Button>
								</div>
							</div>
						</motion.div>

						{/* Featured Product 2 */}
						<motion.div
							className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}
							whileHover={{ y: -5 }}
						>
							<div className="flex h-64 items-center justify-center bg-green-100 p-6">
								<span className="text-6xl">🚲</span>
							</div>
							<div className="p-6">
								<div className="mb-2 flex items-center justify-between">
									<span className="font-medium text-primary text-sm">
										Road Bike
									</span>
									<div className="flex items-center">
										<Star className="h-4 w-4 fill-current text-yellow-500" />
										<span className="ml-1 font-medium text-sm">4.8</span>
									</div>
								</div>
								<h3 className="mb-2 font-semibold text-xl">
									Urban Speedster Pro
								</h3>
								<p className="mb-4 text-gray-600 text-sm">
									Aerodynamic design, lightweight aluminum frame
								</p>
								<div className="flex items-center justify-between">
									<span className="font-bold text-2xl">$899</span>
									<Button size="sm" asChild>
										<Link href="/products/2">Details</Link>
									</Button>
								</div>
							</div>
						</motion.div>

						{/* Featured Product 3 */}
						<motion.div
							className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.6 }}
							whileHover={{ y: -5 }}
						>
							<div className="flex h-64 items-center justify-center bg-purple-100 p-6">
								<span className="text-6xl">🚲</span>
							</div>
							<div className="p-6">
								<div className="mb-2 flex items-center justify-between">
									<span className="font-medium text-primary text-sm">
										Electric Bike
									</span>
									<div className="flex items-center">
										<Star className="h-4 w-4 fill-current text-yellow-500" />
										<span className="ml-1 font-medium text-sm">5.0</span>
									</div>
								</div>
								<h3 className="mb-2 font-semibold text-xl">
									E-Rider Turbo Max
								</h3>
								<p className="mb-4 text-gray-600 text-sm">
									500W motor, 60-mile range, smart display
								</p>
								<div className="flex items-center justify-between">
									<span className="font-bold text-2xl">$1,899</span>
									<Button size="sm" asChild>
										<Link href="/products/3">Details</Link>
									</Button>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="bg-primary py-16 md:py-24">
				<div className="container mx-auto px-4 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
					>
						<h2 className="mb-6 font-bold text-3xl text-white md:text-4xl">
							Ready to Find Your Perfect Bike?
						</h2>
						<p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
							Browse our collection and discover bikes engineered for
							performance, comfort, and style.
						</p>
						<Button
							size="lg"
							variant="secondary"
							asChild
							className="rounded-full px-8"
						>
							<Link href="/products">Shop Collection</Link>
						</Button>
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default HeroLayout;
