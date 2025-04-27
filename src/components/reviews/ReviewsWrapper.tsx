"use client"

import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";

// This would typically come from an API
const reviews = [
  {
    id: 1,
    userName: "Alex Thompson",
    rating: 5,
    comment: "Amazing bike! The suspension handles rough terrain perfectly.",
    date: "2025-03-15"
  },
  {
    id: 2,
    userName: "Sarah Miller",
    rating: 4,
    comment: "Great quality for the price. Very comfortable on long rides.",
    date: "2025-03-10"
  },
  {
    id: 3,
    userName: "Michael Chen",
    rating: 5,
    comment: "Excellent build quality and the color is stunning in person.",
    date: "2025-03-05"
  }
];

interface ReviewsProps {
  productId: number;
}

const Reviews = ({ productId }: ReviewsProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmitReview = () => {
    // Here we would typically send the review to an API
    console.log("Submitting review:", { productId, rating, comment });
    setRating(5);
    setComment("");
  };

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Write a Review</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <div className="mb-2 font-medium">Rating</div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 font-medium">Your Review</div>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="min-h-[100px]"
                />
              </div>
              <Button onClick={handleSubmitReview} className="w-full">
                Submit Review
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold">{review.userName}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${
                          index < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
