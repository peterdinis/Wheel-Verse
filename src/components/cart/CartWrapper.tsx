"use client"

import { ShoppingCart, Minus, Plus, Trash, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import type { FC } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const cartItems = [
  {
    id: 1,
    name: "Alpine Explorer X7",
    price: 1299,
    quantity: 1,
    image: "🚲"
  },
  {
    id: 2,
    name: "Urban Speedster Pro",
    price: 899,
    quantity: 1,
    image: "🚲"
  }
];

const CartWrapper: FC = () => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-3xl font-bold mb-8 flex items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ShoppingCart className="h-8 w-8" />
        Shopping Cart
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="text-4xl">{item.image}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">${item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold">{item.quantity}</span>
                    <Button variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="md:col-span-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full dark:text-white text-black" size="lg">
                <CreditCard className="mr-2 h-4 w-4" />
                Checkout
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CartWrapper;
