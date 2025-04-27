"use client"

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, ChevronLeft, Star, Truck, ShieldCheck } from "lucide-react";

// Sample product data (in a real app, this would come from an API)
const products = [
  {
    id: 1,
    name: "Alpine Explorer X7",
    category: "mountain",
    price: 1299,
    rating: 4.9,
    image: "🚲",
    colors: [
      { name: "Blue", value: "#3b82f6" },
      { name: "Red", value: "#ef4444" },
      { name: "Black", value: "#111827" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "The Alpine Explorer X7 is designed for serious mountain bikers who demand premium performance on challenging trails. With its lightweight carbon frame and responsive suspension system, this bike delivers exceptional control and comfort on any terrain.",
    specs: [
      "Carbon fiber frame",
      "29\" wheels with tubeless-ready rims",
      "12-speed Shimano drivetrain",
      "Front and rear suspension with 140mm travel",
      "Hydraulic disc brakes",
      "Dropper seatpost included"
    ]
  },
  {
    id: 2,
    name: "Urban Speedster Pro",
    category: "road",
    price: 899,
    rating: 4.8,
    image: "🚲",
    colors: [
      { name: "White", value: "#ffffff" },
      { name: "Silver", value: "#d1d5db" },
      { name: "Black", value: "#111827" }
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "The Urban Speedster Pro is built for city streets and paved roads, offering sleek design with practical performance. Lightweight and agile, this bike makes commuting a joy while still providing enough speed for weekend adventures.",
    specs: [
      "Aluminum frame",
      "700c wheels with puncture-resistant tires",
      "Carbon fork",
      "Shimano 105 groupset",
      "Integrated LED lights",
      "Internal cable routing"
    ]
  },
  {
    id: 3,
    name: "E-Rider Turbo Max",
    category: "electric",
    price: 1899,
    rating: 5.0,
    image: "🚲", 
    colors: [
      { name: "Black", value: "#111827" },
      { name: "Blue", value: "#3b82f6" },
      { name: "Green", value: "#10b981" }
    ],
    sizes: ["M", "L", "XL"],
    description: "The E-Rider Turbo Max is our premium electric bike with industry-leading range and power. Perfect for commuting or recreational riding, this e-bike combines cutting-edge electronics with comfortable design for an unmatched riding experience.",
    specs: [
      "500W motor with 5 power modes",
      "Removable 48V lithium-ion battery",
      "60-mile range on a single charge",
      "Full-color LCD display",
      "Hydraulic disc brakes",
      "Integrated front and rear lights",
      "Suspension fork for smooth riding"
    ]
  }
];

export const ProductInfo = () => {
  const { productId } = useParams<{ productId: string }>();
  
  // Find product by ID (in a real app, this would fetch from an API)
  const product = products.find(p => p.id === Number(productId)) || products[0];
  
  // State for selected color and size
  const [selectedColor, setSelectedColor] = useState(product.colors[0].value);
  const [selectedColorName, setSelectedColorName] = useState(product.colors[0].name);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  
  // Handle color selection
  const handleColorSelect = (color: { name: string; value: string }) => {
    setSelectedColor(color.value);
    setSelectedColorName(color.name);
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link to="/products" className="text-primary flex items-center hover:underline">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to all bikes
        </Link>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Product Image/3D Model */}
        <motion.div 
          className="w-full lg:w-1/2 h-[400px] md:h-[500px] bg-muted rounded-xl overflow-hidden"
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
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium text-primary uppercase mr-3">
                {product.category} Bike
              </span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium ml-1">{product.rating} rating</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-bold">${product.price}</p>
          </div>
          
          <div className="mb-6">
            <p className="text-muted-foreground mb-4">
              {product.description}
            </p>
          </div>
          
          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Color: {selectedColorName}</h3>
            <div className="flex gap-3">
              {product.colors.map(color => (
                <button
                  key={color.name}
                  className={`h-10 w-10 rounded-full border-2 ${
                    color.value === selectedColor 
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-gray-300'
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
            <h3 className="text-lg font-semibold mb-3">Size: {selectedSize}</h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={`h-10 px-3 rounded-md border ${
                    size === selectedSize 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-gray-300 hover:border-primary'
                  } focus:outline-none focus:ring-2 focus:ring-primary`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button size="lg" className="flex-grow">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg" className="flex-grow">
              Buy Now
            </Button>
          </div>
          
          {/* Features */}
          <div className="border-t border-border pt-6 space-y-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Free Shipping & Assembly</h4>
                <p className="text-sm text-muted-foreground">Delivered to your door, ready to ride</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">10-Year Warranty</h4>
                <p className="text-sm text-muted-foreground">Industry-leading protection for your investment</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Product Specs */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Specifications</h2>
        <div className="bg-muted rounded-xl p-6">
          <ul className="space-y-3">
            {product.specs.map((spec, index) => (
              <li key={index} className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary mr-3"></div>
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
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products
            .filter(p => p.id !== product.id)
            .map(relatedProduct => (
              <motion.div
                key={relatedProduct.id}
                className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ y: -5 }}
              >
                <Link to={`/products/${relatedProduct.id}`}>
                  <div className={`h-48 p-6 flex items-center justify-center 
                                  ${relatedProduct.category === 'mountain' ? 'bg-blue-100 dark:bg-blue-900/30' : 
                                    relatedProduct.category === 'road' ? 'bg-green-100 dark:bg-green-900/30' : 
                                    relatedProduct.category === 'electric' ? 'bg-purple-100 dark:bg-purple-900/30' : 
                                    'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                    <span className="text-5xl">{relatedProduct.image}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{relatedProduct.name}</h3>
                    <p className="text-primary font-bold">${relatedProduct.price}</p>
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
