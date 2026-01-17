"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Shield,
  Briefcase,
  Heart,
  MessageSquare,
  CheckCircle,
  XCircle,
  DollarSign,
  User,
  Loader2,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface UserDetails {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  bookings: Booking[];
  reviews: Review[];
  wishlist: WishlistItem[];
}

interface Booking {
  id: string;
  bookingNumber: string;
  tourId: string;
  tour: {
    title: string;
    code: string;
  };
  travelDate: string;
  numberOfTravelers: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface Review {
  id: string;
  tourId: string;
  tour: {
    title: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface WishlistItem {
  tour: {
    id: string;
    title: string;
    priceFrom: number;
  };
  createdAt: string;
}

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const { data } = await api.get(`/api/admin/users/${userId}`);
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (newRole: string) => {
    if (!confirm(`Change user role to ${newRole}?`)) return;
    try {
      await api.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      toast.success("User role updated");
      fetchUserDetails();
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  const totalSpent = user.bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const completedBookings = user.bookings.filter(
    (b) => b.status === "CONFIRMED"
  ).length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {user.role === "USER" ? (
            <Button onClick={() => handleRoleChange("ADMIN")} variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Make Admin
            </Button>
          ) : (
            <Button onClick={() => handleRoleChange("USER")} variant="outline">
              <User className="h-4 w-4 mr-2" />
              Remove Admin
            </Button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{user.bookings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedBookings} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{user.reviews.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Written</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Wishlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{user.wishlist.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Saved tours</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="account">Account Details</TabsTrigger>
        </TabsList>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
            </CardHeader>
            <CardContent>
              {user.bookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No bookings yet
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking #</TableHead>
                      <TableHead>Tour</TableHead>
                      <TableHead>Travel Date</TableHead>
                      <TableHead>Travelers</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-sm">
                          {booking.bookingNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {booking.tour.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {booking.tour.code}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(booking.travelDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{booking.numberOfTravelers}</TableCell>
                        <TableCell className="font-medium">
                          ${booking.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {booking.paymentStatus === "PAID" ? (
                            <Badge className="bg-emerald-500">Paid</Badge>
                          ) : booking.paymentStatus === "PENDING" ? (
                            <Badge className="bg-amber-500">Pending</Badge>
                          ) : (
                            <Badge variant="destructive">Failed</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {booking.status === "CONFIRMED" ? (
                            <Badge
                              variant="outline"
                              className="text-emerald-600 border-emerald-600"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Confirmed
                            </Badge>
                          ) : (
                            <Badge variant="outline">{booking.status}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Link href={`/admin/bookings/${booking.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>User Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {user.reviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No reviews yet
                </p>
              ) : (
                <div className="space-y-4">
                  {user.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-4 last:border-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{review.tour.title}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={
                                  i < review.rating
                                    ? "text-amber-400"
                                    : "text-zinc-300"
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>Saved Tours</CardTitle>
            </CardHeader>
            <CardContent>
              {user.wishlist.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No saved tours
                </p>
              ) : (
                <div className="space-y-3">
                  {user.wishlist.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{item.tour.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          From ${item.tour.priceFrom.toLocaleString()}
                        </p>
                      </div>
                      <span className="text-xs text-zinc-500">
                        Saved {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Details Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    User ID
                  </label>
                  <p className="text-sm font-mono mt-1">{user.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="text-sm mt-1 flex items-center gap-2">
                    {user.email}
                    {user.emailVerified && (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Role
                  </label>
                  <p className="text-sm mt-1 font-medium">{user.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Joined
                  </label>
                  <p className="text-sm mt-1">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
