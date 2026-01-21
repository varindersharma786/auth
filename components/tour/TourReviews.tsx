"use client";

import { Tour } from "@/lib/api";
import { Star, User, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TourReviewsProps {
  tour: Tour;
}

export default function TourReviews({ tour }: TourReviewsProps) {
  // Mock data for demonstration - in production, fetch real reviews
  const overallRating = 4.8;
  const totalReviews = 127;
  
  const ratingBreakdown = [
    { stars: 5, count: 98, percentage: 77 },
    { stars: 4, count: 22, percentage: 17 },
    { stars: 3, count: 5, percentage: 4 },
    { stars: 2, count: 2, percentage: 2 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  const reviews = [
    {
      id: "1",
      author: "Sarah Johnson",
      rating: 5,
      date: "2 weeks ago",
      title: "Absolutely incredible experience!",
      content: "This trip exceeded all my expectations. The guides were knowledgeable, the accommodation was comfortable, and the wildlife sightings were spectacular. Highly recommend!",
      helpful: 12,
    },
    {
      id: "2",
      author: "Michael Chen",
      rating: 5,
      date: "1 month ago",
      title: "Trip of a lifetime",
      content: "Amazing organization, beautiful locations, and wonderful group dynamics. Our tour leader was fantastic and made sure everyone had the best experience possible.",
      helpful: 8,
    },
    {
      id: "3",
      author: "Emma Williams",
      rating: 4,
      date: "2 months ago",
      title: "Great adventure with minor hiccups",
      content: "Overall a great trip. The itinerary was well-planned and we saw incredible wildlife. A couple of minor issues with timing but nothing that ruined the experience.",
      helpful: 5,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Reviews</h2>
        <p className="text-zinc-600">
          See what other travelers have said about this trip
        </p>
      </div>

      {/* Overall Rating Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Rating Summary */}
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-6xl font-bold mb-2">{overallRating}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= Math.floor(overallRating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-zinc-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-zinc-600">Based on {totalReviews} reviews</p>
          </CardContent>
        </Card>

        {/* Rating Breakdown */}
        <Card>
          <CardContent className="p-8">
            <h3 className="font-bold mb-4">Rating breakdown</h3>
            <div className="space-y-3">
              {ratingBreakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm font-semibold">{item.stars}</span>
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  </div>
                  <Progress value={item.percentage} className="flex-1" />
                  <span className="text-sm text-zinc-600 w-12 text-right">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Traveler reviews</h3>
        
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-zinc-100 rounded-full">
                  <User className="h-6 w-6 text-zinc-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold">{review.author}</h4>
                      <p className="text-sm text-zinc-500">{review.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-zinc-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <h5 className="font-semibold mb-2">{review.title}</h5>
                  <p className="text-zinc-700 leading-relaxed mb-4">
                    {review.content}
                  </p>
                  
                  <button className="flex items-center gap-2 text-sm text-zinc-600 hover:text-primary transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review CTA */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Been on this trip?</h3>
          <p className="text-zinc-600 mb-4">
            Share your experience and help other travelers make informed decisions
          </p>
          <button className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors">
            Write a review
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
