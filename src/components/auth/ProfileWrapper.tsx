"use client";

import { signOut, useSession } from "next-auth/react";
import type { FC } from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

const fakeBikeOrders = [
  {
    id: 1,
    model: "Trek Domane SL 7",
    image: "/bikes/trek-domane.jpg",
    date: "2025-04-25",
    price: "$5,499",
  },
  {
    id: 2,
    model: "Specialized Turbo Levo",
    image: "/bikes/specialized-levo.jpg",
    date: "2025-04-18",
    price: "$7,300",
  },
  {
    id: 3,
    model: "Cannondale Topstone",
    image: "/bikes/cannondale-topstone.jpg",
    date: "2025-04-10",
    price: "$2,850",
  },
];

const ProfileWrapper: FC = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="text-center mt-24">
        <p className="text-lg mb-4">You are not logged in.</p>
        <Button onClick={() => (window.location.href = "/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center space-y-10">
      <motion.h1
        className="text-3xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Hello, {session.user?.name}
      </motion.h1>

      <motion.div
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md w-full max-w-md text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-gray-500">Email: {session.user?.email}</p>
        <Button className="mt-4" onClick={() => signOut()}>
          Log Out
        </Button>
      </motion.div>

      <div className="w-full max-w-3xl space-y-6">
        <h2 className="text-xl font-semibold">Your Recent Bike Orders</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fakeBikeOrders.map((bike) => (
            <motion.div
              key={bike.id}
              className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-xl transition"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: bike.id * 0.1 }}
            >
              <Image
                src={bike.image}
                alt={bike.model}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold">{bike.model}</h3>
                <p className="text-sm text-gray-500">{bike.date}</p>
                <p className="mt-2 font-semibold">{bike.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileWrapper;
