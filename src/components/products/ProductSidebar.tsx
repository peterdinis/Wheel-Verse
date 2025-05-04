"use client";

import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
} from "../ui/sidebar";

interface PriceRange {
	id: string;
	name: string;
	min?: number;
	max?: number;
}

interface ProductsSidebarProps {
	selectedCategory: string;
	setSelectedCategory: (category: string) => void;
	selectedPriceRange: string;
	setSelectedPriceRange: (rangeId: string, min?: number, max?: number) => void;
	categories: { id: string; name: string }[];
	priceRanges: PriceRange[];
}

export const ProductsSidebar = ({
	selectedCategory,
	setSelectedCategory,
	selectedPriceRange,
	setSelectedPriceRange,
	categories,
	priceRanges,
}: ProductsSidebarProps) => {
	const handlePriceRangeChange = (id: string) => {
		const selected = priceRanges.find((range) => range.id === id);
		setSelectedPriceRange(id, selected?.min, selected?.max);
	};

	return (
		<Sidebar>
			<SidebarHeader className="border-b p-4">
				<div className="flex items-center gap-2 text-primary">
					<Filter className="h-5 w-5" />
					<h2 className="font-semibold text-lg">Filters</h2>
				</div>
			</SidebarHeader>
			<SidebarContent>
				{/* Kategórie */}
				<SidebarGroup>
					<SidebarGroupLabel className="font-medium text-muted-foreground text-sm">
						Categories
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<RadioGroup
							value={selectedCategory}
							onValueChange={setSelectedCategory}
							className="space-y-1"
						>
							{categories.map((category) => (
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.2 }}
									className="flex items-center space-x-2 rounded-lg p-2 transition-colors hover:bg-accent/50"
								>
									<RadioGroupItem
										value={category.id}
										id={`category-${category.id}`}
									/>
									<Label
										htmlFor={`category-${category.id}`}
										className="w-full cursor-pointer text-sm"
									>
										{category.name}
									</Label>
								</motion.div>
							))}
						</RadioGroup>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Cenové rozsahy */}
				<SidebarGroup className="mt-6">
					<SidebarGroupLabel className="font-medium text-muted-foreground text-sm">
						Price Range
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<RadioGroup
							value={selectedPriceRange}
							onValueChange={handlePriceRangeChange}
							className="space-y-1"
						>
							{priceRanges.map((range) => (
								<motion.div
									key={range.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.2 }}
									className="flex items-center space-x-2 rounded-lg p-2 transition-colors hover:bg-accent/50"
								>
									<RadioGroupItem value={range.id} id={`price-${range.id}`} />
									<Label
										htmlFor={`price-${range.id}`}
										className="w-full cursor-pointer text-sm"
									>
										{range.name}
									</Label>
								</motion.div>
							))}
						</RadioGroup>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};
