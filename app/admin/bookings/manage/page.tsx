"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Search,
  Mail,
  Lock,
  CheckCircle,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Loader2,
  Shield,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

interface BookingDetails {
  id: string;
  bookingNumber: string;
  tour: {
    title: string;
    code: string;
    durationDays: number;
  };
  user: {
    name: string;
    email: string;
    id: string;
  };
  travelDate: string;
  numberOfTravelers: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  specialRequests?: string;
  createdAt: string;
  travelers: Traveler[];
}

interface Traveler {
  name: string;
  age: number;
  nationality: string;
}

export default function BookingManagementPage() {
  const [step, setStep] = useState<"search" | "otp" | "dashboard">("search");
  const [bookingNumber, setBookingNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<BookingDetails | null>(null);

  const handleSearch = async () => {
    if (!bookingNumber || !email) {
      toast.error("Please enter booking number and email");
      return;
    }

    setLoading(true);
    try {
      // Request OTP
      await api.post("/api/admin/bookings/request-otp", {
        bookingNumber,
        email,
      });

      toast.success("OTP sent to email");
      setStep("otp");
    } catch (error) {
      toast.error("Booking not found or email doesn't match");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/api/admin/bookings/verify-otp", {
        bookingNumber,
        email,
        otp,
      });

      setBooking(data);
      setStep("dashboard");
      toast.success("Verified successfully");
    } catch (error) {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!booking || !confirm(`Update booking status to ${newStatus}?`)) return;

    try {
      await api.patch(`/api/admin/bookings/${booking.id}/status`, {
        status: newStatus,
      });
      toast.success("Status updated");
      setBooking({ ...booking, status: newStatus });
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handlePaymentUpdate = async (newPaymentStatus: string) => {
    if (!booking || !confirm(`Update payment status to ${newPaymentStatus}?`))
      return;

    try {
      await api.patch(`/api/admin/bookings/${booking.id}/payment`, {
        paymentStatus: newPaymentStatus,
      });
      toast.success("Payment status updated");
      setBooking({ ...booking, paymentStatus: newPaymentStatus });
    } catch (err) {
      toast.error("Failed to update payment");
    }
  };

  if (step === "search") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-zinc-50">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Booking Management</CardTitle>
            <CardDescription>
              Enter booking details to verify and manage customer bookings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bookingNumber">Booking Number</Label>
              <Input
                id="bookingNumber"
                placeholder="BK-123456"
                value={bookingNumber}
                onChange={(e) => setBookingNumber(e.target.value.toUpperCase())}
                className="text-center text-lg font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Customer Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="customer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              className="w-full rounded-full py-6 text-lg"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Send Verification Code
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              An OTP will be sent to the customer's email for verification
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-zinc-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl">Enter Verification Code</CardTitle>
            <CardDescription>OTP sent to {email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">6-Digit Code</Label>
              <Input
                id="otp"
                placeholder="000000"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="text-center text-2xl font-mono tracking-widest"
                maxLength={6}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("search")}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </Button>
            </div>

            <Button
              variant="link"
              className="w-full text-sm"
              onClick={handleSearch}
            >
              Resend Code
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Booking #{booking.bookingNumber}
            </h1>
            <Badge
              className={
                booking.status === "CONFIRMED"
                  ? "bg-emerald-500"
                  : booking.status === "PENDING"
                    ? "bg-amber-500"
                    : "bg-zinc-500"
              }
            >
              {booking.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{booking.tour.title}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setStep("search");
            setBooking(null);
            setOtp("");
          }}
        >
          New Search
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Travel Date</p>
                <p className="font-bold">
                  {new Date(booking.travelDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Travelers</p>
                <p className="font-bold">{booking.numberOfTravelers} people</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-bold">
                  ${booking.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Payment</p>
                <Badge
                  className={
                    booking.paymentStatus === "PAID"
                      ? "bg-emerald-500"
                      : booking.paymentStatus === "PENDING"
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }
                >
                  {booking.paymentStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Booking Details</TabsTrigger>
          <TabsTrigger value="travelers">Travelers</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <p className="font-medium mt-1">{booking.user.name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="font-medium mt-1">{booking.user.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tour Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tour Name</Label>
                <p className="font-medium mt-1">{booking.tour.title}</p>
              </div>
              <div>
                <Label>Tour Code</Label>
                <p className="font-mono mt-1">{booking.tour.code}</p>
              </div>
              <div>
                <Label>Duration</Label>
                <p className="font-medium mt-1">
                  {booking.tour.durationDays} days
                </p>
              </div>
              <div>
                <Label>Booked On</Label>
                <p className="font-medium mt-1">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {booking.specialRequests && (
            <Card>
              <CardHeader>
                <CardTitle>Special Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{booking.specialRequests}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="travelers">
          <Card>
            <CardHeader>
              <CardTitle>Traveler Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Nationality</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {booking.travelers?.map((traveler, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {traveler.name}
                      </TableCell>
                      <TableCell>{traveler.age}</TableCell>
                      <TableCell>{traveler.nationality}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Update Booking Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant={
                    booking.status === "CONFIRMED" ? "default" : "outline"
                  }
                  onClick={() => handleStatusUpdate("CONFIRMED")}
                >
                  Confirm Booking
                </Button>
                <Button
                  variant={
                    booking.status === "CANCELLED" ? "destructive" : "outline"
                  }
                  onClick={() => handleStatusUpdate("CANCELLED")}
                >
                  Cancel Booking
                </Button>
                <Button
                  variant={
                    booking.status === "COMPLETED" ? "default" : "outline"
                  }
                  onClick={() => handleStatusUpdate("COMPLETED")}
                >
                  Mark Complete
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => handlePaymentUpdate("PAID")}
                >
                  Mark as Paid
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePaymentUpdate("PENDING")}
                >
                  Set to Pending
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handlePaymentUpdate("FAILED")}
                >
                  Mark Failed
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
