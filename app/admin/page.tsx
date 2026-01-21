"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  MapPin,
  Plane,
  CreditCard,
  TrendingUp,
  Calendar,
  DollarSign,
  Star,
} from "lucide-react";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface DashboardStats {
  totalUsers: number;
  totalTours: number;
  totalDestinations: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  recentBookings: Array<{
    id: string;
    user: { name: string; email: string };
    tour: { title: string; code: string };
    totalPrice: number;
    status: string;
    createdAt: string;
  }>;
  popularTours: Array<{
    id: string;
    title: string;
    code: string;
    _count: { bookings: number };
  }>;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/api/admin/dashboard/stats");
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Tours",
      value: stats?.totalTours || 0,
      icon: Plane,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Destinations",
      value: stats?.totalDestinations || 0,
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings || 0,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Pending Bookings",
      value: stats?.pendingBookings || 0,
      icon: TrendingUp,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Confirmed Bookings",
      value: stats?.confirmedBookings || 0,
      icon: Star,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Payment Methods",
      value: "PayPal",
      icon: CreditCard,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here&apos;s what&apos;s happening with your tours.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings & Popular Tours */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentBookings && stats.recentBookings.length > 0 ? (
                stats.recentBookings.slice(0, 5).map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/admin/bookings/manage`}
                    className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{booking.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.tour.title}
                        </p>
                      </div>
                      <Badge
                        variant={
                          booking.status === "CONFIRMED"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        {format(new Date(booking.createdAt), "MMM dd, yyyy")}
                      </span>
                      <span className="font-semibold">
                        ${booking.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No bookings yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Popular Tours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Popular Tours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.popularTours && stats.popularTours.length > 0 ? (
                stats.popularTours.slice(0, 5).map((tour) => (
                  <Link
                    key={tour.id}
                    href={`/admin/tours`}
                    className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{tour.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {tour.code}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {tour._count.bookings} bookings
                      </Badge>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No tours data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Link
              href="/admin/tours/create-tour"
              className="p-4 rounded-lg border hover:bg-accent transition-colors text-center"
            >
              <Plane className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-semibold">Create Tour</p>
            </Link>
            <Link
              href="/admin/destinations/create"
              className="p-4 rounded-lg border hover:bg-accent transition-colors text-center"
            >
              <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-semibold">Add Destination</p>
            </Link>
            <Link
              href="/admin/bookings/manage"
              className="p-4 rounded-lg border hover:bg-accent transition-colors text-center"
            >
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-semibold">Manage Bookings</p>
            </Link>
            <Link
              href="/admin/users"
              className="p-4 rounded-lg border hover:bg-accent transition-colors text-center"
            >
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-semibold">View Users</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
