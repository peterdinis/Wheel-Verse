"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

const categories = [
	{
		id: "mountain",
		name: "Mountain Bikes",
		description: "Perfect for off-road adventures and trail riding",
		image: "🏔️",
		count: 12,
		color: "bg-blue-100 dark:bg-blue-900/30",
	},
	{
		id: "road",
		name: "Road Bikes",
		description: "Built for speed and efficiency on paved roads",
		image: "🛣️",
		count: 8,
		color: "bg-green-100 dark:bg-green-900/30",
	},
	{
		id: "electric",
		name: "Electric Bikes",
		description: "Power-assisted cycling for effortless rides",
		image: "⚡",
		count: 10,
		color: "bg-purple-100 dark:bg-purple-900/30",
	},
	{
		id: "urban",
		name: "Urban Bikes",
		description: "Comfortable and stylish for city commuting",
		image: "🌆",
		count: 6,
		color: "bg-yellow-100 dark:bg-yellow-900/30",
	},
];

const CategoriesWrapper = () => {
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(2);

	const filteredCategories = useMemo(() => {
		return categories.filter((cat) =>
			cat.name.toLowerCase().includes(search.toLowerCase())
		);
	}, [search]);

	const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
	const paginated = filteredCategories.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handlePageChange = (dir: "prev" | "next") => {
		setCurrentPage((prev) =>
			dir === "prev" ? Math.max(prev - 1, 1) : Math.min(prev + 1, totalPages)
		);
	};

	return (
		<div className="container mx-auto px-4 py-16">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="mb-12 text-center"
			>
				<h1 className="mb-4 font-bold text-4xl">Bike Categories</h1>
				<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
					Explore our diverse range of bicycles, from mountain bikes to urban
					commuters. Find the perfect ride for your adventure.
				</p>
			</motion.div>

			<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<Input
					placeholder="Search categories..."
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						setCurrentPage(1);
					}}
					className="w-full md:w-1/3"
				/>

				<div className="flex items-center gap-4">
					<Select
						value={itemsPerPage.toString()}
						onValueChange={(val) => {
							setItemsPerPage(Number(val));
							setCurrentPage(1);
						}}
					>
						<SelectTrigger className="w-[120px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="2">2 per page</SelectItem>
							<SelectItem value="4">4 per page</SelectItem>
							<SelectItem value="6">6 per page</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
				{paginated.map((category, index) => (
					<motion.div
						key={category.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
					>
						<Link href={`/products?category=${category.id}`}>
							<Card className="transition-shadow duration-300 hover:shadow-lg">
								<CardContent className="p-6">
									<div
										className={`${category.color} mb-6 rounded-lg p-8 text-center`}
									>
										<span className="text-6xl">{category.image}</span>
									</div>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<h3 className="font-semibold text-2xl">
												{category.name}
											</h3>
											<span className="text-muted-foreground text-sm">
												{category.count} bikes
											</span>
										</div>
										<p className="text-muted-foreground">
											{category.description}
										</p>
										<Button className="w-full">Browse {category.name}</Button>
									</div>
								</CardContent>
							</Card>
						</Link>
					</motion.div>
				))}
			</div>

			{/* Pagination Controls */}
			{totalPages > 1 && (
				<div className="mt-10 flex items-center justify-center gap-4">
					<Button
						variant="outline"
						onClick={() => handlePageChange("prev")}
						disabled={currentPage === 1}
					>
						Previous
					</Button>
					<span className="text-muted-foreground">
						Page {currentPage} of {totalPages}
					</span>
					<Button
						variant="outline"
						onClick={() => handlePageChange("next")}
						disabled={currentPage === totalPages}
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
};

export default CategoriesWrapper;
