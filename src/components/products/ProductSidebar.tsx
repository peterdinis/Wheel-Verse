"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Ghost, Loader2, Search, X, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type FC, useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { Input } from "../ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";
import { PaginationControl } from "./PaginationControl";

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

const priceRanges: PriceRange[] = [
  { id: "all", name: "All Prices", min: 0, max: 10000 },
  { id: "under-700", name: "Under $700", min: 0, max: 700 },
  { id: "700-1000", name: "$700 - $1000", min: 700, max: 1000 },
  { id: "1000-1500", name: "$1000 - $1500", min: 1000, max: 1500 },
  { id: "over-1500", name: "Over $1500", min: 1500, max: 10000 },
];

export const ProductsSidebar: FC<ProductsSidebarProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedPriceRange,
  setSelectedPriceRange,
  categories,
  priceRanges,
}) => {
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
        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-medium text-muted-foreground text-sm">
            Categories
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <motion.div layout className="space-y-1">
              {categories.map((category) => (
                <motion.label
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  htmlFor={`category-${category.id}`}
                  className="flex items-center space-x-2 rounded-lg p-2 cursor-pointer transition-colors hover:bg-accent/50"
                >
                  <input
                    type="radio"
                    id={`category-${category.id}`}
                    name="category"
                    value={category.id}
                    checked={selectedCategory === category.id}
                    onChange={() => setSelectedCategory(category.id)}
                    className="radio"
                  />
                  <span className="text-sm">{category.name}</span>
                </motion.label>
              ))}
            </motion.div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Price Ranges */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="font-medium text-muted-foreground text-sm">
            Price Range
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <motion.div layout className="space-y-1">
              {priceRanges.map((range) => (
                <motion.label
                  key={range.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  htmlFor={`price-${range.id}`}
                  className="flex items-center space-x-2 rounded-lg p-2 cursor-pointer transition-colors hover:bg-accent/50"
                >
                  <input
                    type="radio"
                    id={`price-${range.id}`}
                    name="price"
                    value={range.id}
                    checked={selectedPriceRange === range.id}
                    onChange={() => handlePriceRangeChange(range.id)}
                    className="radio"
                  />
                  <span className="text-sm">{range.name}</span>
                </motion.label>
              ))}
            </motion.div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};