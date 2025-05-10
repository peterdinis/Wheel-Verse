"use client";

import { motion } from "framer-motion";
import {
	ChevronLeft,
	ShieldCheck,
	ShoppingCart,
	Star,
	Truck,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { BicycleModel } from "../home/BicycleModel";
import Reviews from "../reviews/ReviewsWrapper";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";

export const ProductInfo = () => {
	const { productId } = useParams<{ productId: string }>();
	const [product, setProduct] = useState(null);
	const [selectedColor, setSelectedColor] = useState<string>("");
	const [selectedSize, setSelectedSize] = useState<string>("");

	const { data, isLoading, isError } = api.product.getById.useQuery(
		{ id: productId },
	);

	useEffect(() => {
		if (data) {
			setProduct(data);
		}
	}, [data]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !product) {
		return <div>Error loading product information.</div>;
	}

	// Handle color selection
	const handleColorSelect = (color: { name: string; value: string }) => {
		setSelectedColor(color.value);
	};

	return (
		<div className="container mx-auto px-4 py-12">
			{/* Breadcrumb */}
			<div className="mb-8">
				<Link
					href="/products"
					className="flex items-center text-primary hover:underline"
				>
					<ChevronLeft className="mr-1 h-4 w-4" />
					Back to all bikes
				</Link>
			</div>

			<div className="flex flex-col gap-12 lg:flex-row">
				{/* Product Image/3D Model */}
				<motion.div
					className="h-[400px] w-full overflow-hidden rounded-xl bg-muted md:h-[500px] lg:w-1/2"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6 }}
				>
					<div className="h-full w-full">
						<BicycleModel autoRotate={false} color={selectedColor} />
					</div>
				</motion.div>

				{/* Product Details */}
				<motion.div
					className="w-full lg:w-1/2"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6 }}
				>
					<div className="mb-6">
						<div className="mb-2 flex items-center">
							<span className="mr-3 font-medium text-primary text-sm uppercase">
								{product.category} Bike
							</span>
							<div className="flex items-center">
								<Star className="h-4 w-4 fill-current text-yellow-500" />
								<span className="ml-1 font-medium text-sm">
									{product.rating} rating
								</span>
							</div>
						</div>
						<h1 className="mb-4 font-bold text-3xl md:text-4xl">
							{product.name}
						</h1>
						<p className="font-bold text-2xl">${product.price}</p>
					</div>

					<div className="mb-6">
						<p className="mb-4 text-muted-foreground">{product.description}</p>
					</div>

					{/* Color Selection */}
					<div className="mb-6">
						<h3 className="mb-3 font-semibold text-lg">
							Color: {selectedColor}
						</h3>
						<div className="flex gap-3">
							{product.colors.map((color) => (
								<button
									key={color.name}
									className={`h-10 w-10 rounded-full border-2 ${
										color.value === selectedColor
											? "border-primary ring-2 ring-primary/30"
											: "border-gray-300"
									} focus:outline-none`}
									style={{ backgroundColor: color.value }}
									aria-label={`Select ${color.name} color`}
									onClick={() => handleColorSelect(color)}
								/>
							))}
						</div>
					</div>

					{/* Size Selection */}
					<div className="mb-8">
						<h3 className="mb-3 font-semibold text-lg">Size: {selectedSize}</h3>
						<div className="flex flex-wrap gap-3">
							{product.sizes.map((size) => (
								<button
									key={size}
									className={`h-10 rounded-md border px-3 ${
										size === selectedSize
											? "border-primary bg-primary/10 text-primary"
											: "border-gray-300 hover:border-primary"
									} focus:outline-none focus:ring-2 focus:ring-primary`}
									onClick={() => setSelectedSize(size)}
								>
									{size}
								</button>
							))}
						</div>
					</div>

					{/* Add to Cart */}
					<div className="mb-8 flex flex-col gap-4 sm:flex-row">
						<Button size="lg" className="flex-grow">
							<ShoppingCart className="mr-2 h-5 w-5" />
							Add to Cart
						</Button>
						<Button variant="outline" size="lg" className="flex-grow">
							Buy Now
						</Button>
					</div>

					{/* Features */}
					<div className="space-y-4 border-border border-t pt-6">
						<div className="flex items-center">
							<div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<Truck className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h4 className="font-medium">Free Shipping & Assembly</h4>
								<p className="text-muted-foreground text-sm">
									Delivered to your door, ready to ride
								</p>
							</div>
						</div>

						<div className="flex items-center">
							<div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<ShieldCheck className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h4 className="font-medium">10-Year Warranty</h4>
								<p className="text-muted-foreground text-sm">
									Industry-leading protection for your investment
								</p>
							</div>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Product Specs */}
			<div className="mt-16">
				<h2 className="mb-6 font-bold text-2xl">Specifications</h2>
				<div className="rounded-xl bg-muted p-6">
					<ul className="space-y-3">
						{product.specs.map((spec, index) => (
							<li key={index} className="flex items-center">
								<div className="mr-3 h-2 w-2 rounded-full bg-primary"></div>
								{spec}
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* Reviews Section */}
			<Reviews productId={Number(productId)} />

			{/* Related Products */}
			<div className="mt-16">
				<h2 className="mb-6 font-bold text-2xl">You May Also Like</h2>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{products
						.filter((p) => p.id !== product.id)
						.map((relatedProduct) => (
							<motion.div
								key={relatedProduct.id}
								className="overflow-hidden rounded-xl bg-card shadow-sm transition-shadow hover:shadow-md"
								whileHover={{ y: -5 }}
							>
								<Link href={`/products/${relatedProduct.id}`}>
									<div
										className={`flex h-48 items-center justify-center p-6 ${
											relatedProduct.category === "mountain"
												? "bg-blue-100 dark:bg-blue-900/30"
												: relatedProduct.category === "road"
													? "bg-green-100 dark:bg-green-900/30"
													: relatedProduct.category === "electric"
														? "bg-purple-100 dark:bg-purple-900/30"
														: "bg-yellow-100 dark:bg-yellow-900/30"
										}`}
									>
										<span className="text-5xl">{relatedProduct.image}</span>
									</div>
									<div className="p-4">
										<h3 className="text-lg font-medium">{relatedProduct.name}</h3>
										<p className="text-sm text-muted-foreground">
											{relatedProduct.category} Bike
										</p>
										<p className="text-xl font-bold">${relatedProduct.price}</p>
									</div>
								</Link>
							</motion.div>
						))}
				</div>
			</div>
		</div>
	);
};
