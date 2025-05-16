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
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { BicycleModel } from "../home/BicycleModel";
import Reviews from "../reviews/ReviewsWrapper";
import { Button } from "../ui/button";

export const ProductInfo = () => {
	const { productId } = useParams<{ productId: string }>();
	const [product, setProduct] = useState(null);
	const [selectedColor, setSelectedColor] = useState<string>("");
	const [selectedSize, setSelectedSize] = useState<string>("");
	const [relatedProducts, setRelatedProducts] = useState<any[]>([]); // New state for related products

	// Fetch product data
	const { data, isLoading, isError } = api.product.getById.useQuery({
		id: productId,
	});

	// Fetch related products (assuming you have an API for this)
	const { data: relatedData } = api.product.getById.useQuery({ id: productId });

	useEffect(() => {
		if (data) {
			setProduct(data);
		}
		if (relatedData) {
			setRelatedProducts(relatedData);
		}
	}, [data, relatedData]);

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

			{/* Reviews Section */}
			<Reviews productId={Number(productId)} />

			{/* Related Products */}
			<div className="mt-16">
				<h2 className="mb-6 font-bold text-2xl">You May Also Like</h2>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{relatedProducts.map((relatedProduct) => (
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
									<h3 className="font-medium text-lg">{relatedProduct.name}</h3>
									<p className="text-muted-foreground text-sm">
										{relatedProduct.category} Bike
									</p>
									<p className="font-bold text-xl">${relatedProduct.price}</p>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ProductInfo;
