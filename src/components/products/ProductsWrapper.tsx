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
  const [priceRangeMin, setPriceRangeMin] = useState<number | undefined>(0);
  const [priceRangeMax, setPriceRangeMax] = useState<number | undefined>(10000);
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
      name: `${cat.name} - ${cat.id.slice(0, 4)}`,
    })),
  ];

  const productsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Update min and max price when price range changes
  const handleSetSelectedPriceRange = (
    rangeId: string,
    min?: number,
    max?: number,
  ) => {
    setSelectedPriceRange(rangeId);
    setPriceRangeMin(min);
    setPriceRangeMax(max);
  };

  const filteredProducts =
    data?.products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.category?.id === selectedCategory;

      const matchesPrice =
        (priceRangeMin === undefined || product.price >= priceRangeMin) &&
        (priceRangeMax === undefined || product.price <= priceRangeMax);

      return matchesSearch && matchesCategory && matchesPrice;
    }) || [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0; // featured or default sorting (can be extended)
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
          setSelectedPriceRange={handleSetSelectedPriceRange}
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
                  className="-translate-y-1/2 absolute top-1/2 right-3 rounded-full p-1 hover:bg-muted"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sort select */}
          <div className="mt-6 flex justify-end">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded border border-border bg-background p-2 text-foreground shadow-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-lg border border-border bg-card p-4 shadow-sm hover:shadow-md"
                >
                  <Link
                    href={`/products/${product.id}`}
                    className="flex flex-col space-y-3"
                  >
                    <div className="relative h-48 w-full overflow-hidden rounded-lg">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]?.url}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw,
                            (max-width: 1200px) 50vw,
                            33vw"
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <Ghost className="mx-auto my-12 h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-auto text-primary font-bold text-xl">
                      ${product.price.toFixed(2)}
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No products found.
              </div>
            )}
          </div>

          {/* Pagination */}
          <PaginationControl
            total={sortedProducts.length}
            pageSize={productsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProductsWrapper