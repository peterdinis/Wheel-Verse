"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import { type FC, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { PaginationControl } from "./PaginationControl";
import { ProductsSidebar } from "./ProductSidebar";
import { api } from "~/trpc/react";
import Image from "next/image";

// Filter options
const categories = [
	{ id: "all", name: "All Bikes" },
	{ id: "mountain", name: "Mountain Bikes" },
	{ id: "road", name: "Road Bikes" },
	{ id: "electric", name: "Electric Bikes" },
	{ id: "urban", name: "Urban Bikes" },
];

// Price range options
const priceRanges = [
	{ id: "all", name: "All Prices", min: 0, max: 10000 },
	{ id: "under-700", name: "Under $700", min: 0, max: 700 },
	{ id: "700-1000", name: "$700 - $1000", min: 700, max: 1000 },
	{ id: "1000-1500", name: "$1000 - $1500", min: 1000, max: 1500 },
	{ id: "over-1500", name: "Over $1500", min: 1500, max: 10000 },
];

const ProductsWrapper: FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [selectedPriceRange, setSelectedPriceRange] = useState("all");
	const [sortBy, setSortBy] = useState("featured");

	const { data, isLoading } = api.product.list.useQuery({});

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const productsPerPage = 6;

	// Get current price range
	const currentPriceRange =
		priceRanges.find((range) => range.id === selectedPriceRange) ||
		priceRanges[0];

	// Filter products based on search and filters
	const filteredProducts = data?.products.filter((product) => {
		// Filter by search query
		const matchesSearch =
			product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.description!.toLowerCase().includes(searchQuery.toLowerCase());

		// Filter by price range
		const matchesPrice =
			product.price >= currentPriceRange!.min &&
			product.price <= currentPriceRange!.max;

		return matchesSearch && matchesPrice;
	}) || [];

	// Sort products
	const sortedProducts = [...filteredProducts].sort((a, b) => {
		if (sortBy === "price-asc") return a.price - b.price;
		if (sortBy === "price-desc") return b.price - a.price;
		// Default: featured
		return 0;
	});

	// Get current page products
	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = sortedProducts.slice(
		indexOfFirstProduct,
		indexOfLastProduct,
	);

	// Change page
	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		window.scrollTo(0, 0);
	};

	// Reset pagination when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, selectedCategory, selectedPriceRange, sortBy]);

	if (isLoading) return <Loader2 className="animate-spin w-8 h-8" />

	return (
		<SidebarProvider>
			<div className="flex min-h-screen w-full">
				<ProductsSidebar
					selectedCategory={selectedCategory}
					setSelectedCategory={setSelectedCategory}
					selectedPriceRange={selectedPriceRange}
					setSelectedPriceRange={setSelectedPriceRange}
					categories={categories}
					priceRanges={priceRanges}
				/>

				<div className="container mx-auto flex-1 px-4 py-12">
					<div className="mb-8 flex items-center justify-between">
						<div>
							<h1 className="mb-4 font-bold text-3xl md:text-4xl">
								Our Bikes Collection
							</h1>
							<p className="text-gray-600 text-lg">
								Find the perfect bike for your adventures
							</p>
						</div>
						<SidebarTrigger />
					</div>

					{/* Search and Sort Controls */}
					<div className="mb-8 flex flex-col justify-between gap-4 md:flex-row">
						<motion.div
							className="relative max-w-md flex-grow"
							initial={false}
							animate={{ scale: searchQuery ? 1.02 : 1 }}
							transition={{ duration: 0.2 }}
						>
							<Input
								type="text"
								placeholder="Search bikes..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full rounded-md border bg-background p-3 pl-10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
							/>
							<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
							<AnimatePresence>
								{searchQuery && (
									<motion.button
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										onClick={() => setSearchQuery("")}
										className="-translate-y-1/2 absolute top-1/2 right-3 transform"
									>
										<X className="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground" />
									</motion.button>
								)}
							</AnimatePresence>
						</motion.div>

						{/* Sort Dropdown */}
						<div className="relative">
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="appearance-none rounded-md border bg-background p-3 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
							>
								<option value="featured">Featured</option>
								<option value="price-asc">Price: Low to High</option>
								<option value="price-desc">Price: High to Low</option>
								<option value="rating">Rating</option>
							</select>
						</div>
					</div>

					{/* Product List */}
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{currentProducts.map((product) => (
							<div key={product.id} className="border p-6 rounded-lg">
								<div className="flex justify-center mb-4">
									<Image
										src={product.imageUrl!}
										alt={product.name

										}
										width={100}
										height={100}
									/>
								</div>
								<h2 className="text-xl font-semibold">{product.name}</h2>
								<p className="text-gray-600">{product.description}</p>
								<p className="text-lg font-bold mt-2">${product.price}</p>
							</div>
						))}
					</div>

					{/* Pagination */}
					<PaginationControl
						currentPage={currentPage}
						totalPages={Math.ceil(sortedProducts.length / productsPerPage)}
						onPageChange={handlePageChange}
					/>
				</div>
			</div>
		</SidebarProvider>
	);
};

export default ProductsWrapper;
