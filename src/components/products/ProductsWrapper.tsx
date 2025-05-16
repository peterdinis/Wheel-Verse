"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Ghost, Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type FC, useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { Input } from "../ui/input";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { PaginationControl } from "./PaginationControl";
import { ProductsSidebar } from "./ProductSidebar";

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

	const { data, isLoading, isError } = api.product.list.useQuery({});
	const categories = [
		{ id: "all", name: "All Categories" },
		...Array.from(
			new Map(
				data?.products
					.map((p) => p.category)
					.filter((c): c is NonNullable<typeof c> => !!c)
					.map((c) => [c.id, c]),
			).values(),
		).map((cat) => ({
			id: cat.id,
			name: `${cat.name}-${cat.id.slice(0, 4)}`,
		})),
	];

	const [currentPage, setCurrentPage] = useState(1);
	const productsPerPage = 6;

	const currentPriceRange =
		priceRanges.find((range) => range.id === selectedPriceRange) ||
		priceRanges[0];

	const filteredProducts =
		data?.products.filter((product) => {
			const matchesSearch =
				product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.description?.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesCategory =
				selectedCategory === "all" || product.category?.id === selectedCategory;

			const matchesPrice =
				product.price >= currentPriceRange!.min &&
				product.price <= currentPriceRange!.max;

			return matchesSearch && matchesCategory && matchesPrice;
		}) || [];

	const sortedProducts = [...filteredProducts].sort((a, b) => {
		if (sortBy === "price-asc") return a.price - b.price;
		if (sortBy === "price-desc") return b.price - a.price;
		return 0;
	});

	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = sortedProducts.slice(
		indexOfFirstProduct,
		indexOfLastProduct,
	);

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		window.scrollTo(0, 0);
	};

	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, selectedCategory, selectedPriceRange, sortBy]);

	if (isLoading)
		return <Loader2 className="mx-auto mt-20 h-8 w-8 animate-spin" />;

	if (isError)
		return (
			<div className="mt-4 text-center font-bold text-red-800 text-xl">
				Error fetching products
			</div>
		);

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
							<p className="text-gray-600 text-lg dark:text-sky-100">
								Find the perfect bike for your adventures
							</p>
						</div>
						<SidebarTrigger />
					</div>

					{/* Search */}
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
							className="w-full rounded-full border border-border bg-background p-3 pr-10 pl-10 text-foreground shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
						/>
						<Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
						<AnimatePresence>
							{searchQuery && (
								<motion.button
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
									onClick={() => setSearchQuery("")}
									className="-translate-y-1/2 absolute top-1/2 right-3 rounded-full p-1 transition-colors hover:bg-muted"
									aria-label="Clear search"
								>
									<X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
								</motion.button>
							)}
						</AnimatePresence>
					</motion.div>

					{/* Product List */}
					{currentProducts.length === 0 ? (
						<div className="mt-20 flex flex-col items-center justify-center text-center text-muted-foreground">
							<Ghost className="mb-4 h-16 w-16 animate-bounce text-gray-400" />
							<h3 className="font-semibold text-2xl">No bikes found</h3>
							<p className="mt-2 text-gray-500">
								Try adjusting your search or filters to find something else.
							</p>
						</div>
					) : (
						<div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
							{currentProducts.map((product) => (
								<div
									key={product.id}
									className="flex flex-col justify-between rounded-lg border p-6"
								>
									<div>
										<div className="mb-4 flex justify-center">
											<Image
												src={product.imageUrl!}
												alt={product.name}
												width={100}
												height={100}
											/>
										</div>
										<h2 className="font-semibold text-xl">{product.name}</h2>
										<p className="text-gray-600 dark:text-blue-50">
											{product.description}
										</p>
										<p className="mt-2 font-bold text-lg">${product.price}</p>
									</div>
									<Link
										href={`/products/${product.id}`}
										className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-center text-white transition hover:bg-primary/90"
									>
										View Details
									</Link>
								</div>
							))}
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
		</SidebarProvider>
	);
};

export default ProductsWrapper;
