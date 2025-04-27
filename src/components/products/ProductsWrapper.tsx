"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, Star, X } from "lucide-react";
import Link from "next/link";
import { type FC, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { PaginationControl } from "./PaginationControl";
import { ProductsSidebar } from "./ProductSidebar";

const products = [
	{
		id: 1,
		name: "Alpine Explorer X7",
		category: "mountain",
		price: 1299,
		rating: 4.9,
		image: "🚲",
		description: 'Carbon frame, 29" wheels, premium suspension',
	},
	{
		id: 2,
		name: "Urban Speedster Pro",
		category: "road",
		price: 899,
		rating: 4.8,
		image: "🚲",
		description: "Aerodynamic design, lightweight aluminum frame",
	},
	{
		id: 3,
		name: "E-Rider Turbo Max",
		category: "electric",
		price: 1899,
		rating: 5.0,
		image: "🚲",
		description: "500W motor, 60-mile range, smart display",
	},
	{
		id: 4,
		name: "Trail Blazer S4",
		category: "mountain",
		price: 1099,
		rating: 4.7,
		image: "🚲",
		description: "Durable frame, front suspension, all-terrain tires",
	},
	{
		id: 5,
		name: "City Cruiser Deluxe",
		category: "urban",
		price: 699,
		rating: 4.6,
		image: "🚲",
		description: "Comfortable ride, basket included, upright position",
	},
	{
		id: 6,
		name: "Speed Demon Pro",
		category: "road",
		price: 1499,
		rating: 4.9,
		image: "🚲",
		description: "Carbon frame, electronic shifting, aerodynamic",
	},
	{
		id: 7,
		name: "Mountain Master Elite",
		category: "mountain",
		price: 1599,
		rating: 4.8,
		image: "🚲",
		description: "Full suspension, hydraulic brakes, tubeless ready",
	},
	{
		id: 8,
		name: "E-Commuter Plus",
		category: "electric",
		price: 1399,
		rating: 4.7,
		image: "🚲",
		description: "350W motor, integrated lights, fenders included",
	},
];

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
	const [filterOpen, setFilterOpen] = useState(false);

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const productsPerPage = 6;

	// Get current price range
	const currentPriceRange =
		priceRanges.find((range) => range.id === selectedPriceRange) ||
		priceRanges[0];

	// Filter products based on search and filters
	const filteredProducts = products.filter((product) => {
		// Filter by search query
		const matchesSearch =
			product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.description.toLowerCase().includes(searchQuery.toLowerCase());

		// Filter by category
		const matchesCategory =
			selectedCategory === "all" || product.category === selectedCategory;

		// Filter by price range
		const matchesPrice =
			product.price >= currentPriceRange!.min &&
			product.price <= currentPriceRange!.max;

		return matchesSearch && matchesCategory && matchesPrice;
	});

	// Sort products
	const sortedProducts = [...filteredProducts].sort((a, b) => {
		if (sortBy === "price-asc") return a.price - b.price;
		if (sortBy === "price-desc") return b.price - a.price;
		if (sortBy === "rating") return b.rating - a.rating;
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

	const toggleFilter = () => setFilterOpen(!filterOpen);

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
								<option value="rating">Highest Rated</option>
							</select>
							<ChevronDown className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 h-4 w-4 transform text-muted-foreground" />
						</div>
					</div>

					{/* Products Grid */}
					<div className="flex-grow">
						{/* Results Count */}
						<div className="mb-5">
							<p className="text-muted-foreground">
								Showing {indexOfFirstProduct + 1}-
								{Math.min(indexOfLastProduct, sortedProducts.length)} of{" "}
								{sortedProducts.length} results
							</p>
						</div>

						{/* Products Grid */}
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{currentProducts.map((product) => (
								<motion.div
									key={product.id}
									className="group overflow-hidden rounded-xl bg-card shadow-sm transition-all duration-300 hover:shadow-md"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.4 }}
									whileHover={{ y: -5 }}
								>
									<Link
										href={`/products/${product.id}`}
										className="relative block h-full"
									>
										<div
											className={`flex h-48 items-center justify-center p-6 transition-colors duration-300 ${
												product.category === "mountain"
													? "bg-blue-100 dark:bg-blue-900/30"
													: product.category === "road"
														? "bg-green-100 dark:bg-green-900/30"
														: product.category === "electric"
															? "bg-purple-100 dark:bg-purple-900/30"
															: "bg-yellow-100 dark:bg-yellow-900/30"
											}`}
										>
											<span className="text-5xl transition-transform duration-300 group-hover:scale-110">
												{product.image}
											</span>
										</div>
										<div className="p-4">
											<div className="mb-2 flex items-center justify-between">
												<span className="font-medium text-primary text-xs uppercase">
													{product.category} Bike
												</span>
												<div className="flex items-center">
													<Star className="h-3 w-3 fill-current text-yellow-500" />
													<span className="ml-1 font-medium text-xs">
														{product.rating}
													</span>
												</div>
											</div>
											<h3 className="mb-1 font-semibold text-lg">
												{product.name}
											</h3>
											<p className="mb-3 text-muted-foreground text-sm">
												{product.description}
											</p>
											<div className="flex items-center justify-between">
												<span className="font-bold text-xl">
													${product.price}
												</span>
												<Button
													className="text-black dark:text-white"
													size="sm"
												>
													View Details
												</Button>
											</div>
										</div>
									</Link>
								</motion.div>
							))}
						</div>

						{/* Empty State */}
						{sortedProducts.length === 0 && (
							<div className="py-12 text-center">
								<h3 className="mb-2 font-semibold text-xl">No bikes found</h3>
								<p className="mb-4 text-muted-foreground">
									Try adjusting your filters or search query
								</p>
								<Button
									onClick={() => {
										setSearchQuery("");
										setSelectedCategory("all");
										setSelectedPriceRange("all");
									}}
								>
									Reset Filters
								</Button>
							</div>
						)}

						{/* Pagination */}
						{sortedProducts.length > 0 && (
							<PaginationControl
								currentPage={currentPage}
								totalPages={Math.ceil(sortedProducts.length / productsPerPage)}
								onPageChange={handlePageChange}
							/>
						)}
					</div>
				</div>
			</div>
		</SidebarProvider>
	);
};

export default ProductsWrapper;
