"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface TourDeparture {
  id: string;
  departureDate: string;
  endDate: string;
  price: number;
  discountedPrice?: number;
  availableSpaces: number;
  status: string;
}

export default function TourDeparturesPage() {
  const params = useParams();
  const router = useRouter();
  const tourId = params?.id as string;

  const [departures, setDepartures] = useState<TourDeparture[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    departureDate: "",
    endDate: "",
    price: "",
    discountedPrice: "",
    availableSpaces: "",
    status: "AVAILABLE",
  });

  useEffect(() => {
    if (tourId) {
      fetchDepartures();
    }
  }, [tourId]);

  const fetchDepartures = async () => {
    try {
      const { data } = await api.get(`/api/departures/tour/${tourId}`);
      setDepartures(data);
    } catch (error) {
      console.error("Failed to fetch departures:", error);
      toast.error("Failed to load departures");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      tourId,
      departureDate: formData.departureDate,
      endDate: formData.endDate,
      price: parseFloat(formData.price),
      discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : null,
      availableSpaces: parseInt(formData.availableSpaces),
      status: formData.status,
    };

    try {
      if (editingId) {
        await api.put(`/api/departures/${editingId}`, payload);
        toast.success("Departure updated successfully");
      } else {
        await api.post("/api/departures", payload);
        toast.success("Departure created successfully");
      }
      
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchDepartures();
    } catch (error) {
      console.error("Failed to save departure:", error);
      toast.error("Failed to save departure");
    }
  };

  const handleEdit = (departure: TourDeparture) => {
    setFormData({
      departureDate: departure.departureDate.split("T")[0],
      endDate: departure.endDate.split("T")[0],
      price: departure.price.toString(),
      discountedPrice: departure.discountedPrice?.toString() || "",
      availableSpaces: departure.availableSpaces.toString(),
      status: departure.status,
    });
    setEditingId(departure.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this departure?")) return;
    
    try {
      await api.delete(`/api/departures/${id}`);
      toast.success("Departure deleted successfully");
      fetchDepartures();
    } catch (error) {
      console.error("Failed to delete departure:", error);
      toast.error("Failed to delete departure");
    }
  };

  const resetForm = () => {
    setFormData({
      departureDate: "",
      endDate: "",
      price: "",
      discountedPrice: "",
      availableSpaces: "",
      status: "AVAILABLE",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tour Departures</h1>
          <p className="text-muted-foreground">Manage departure dates and pricing</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowForm(!showForm);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Departure
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit" : "Add"} Departure</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departureDate">Departure Date *</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountedPrice">Discounted Price</Label>
                  <Input
                    id="discountedPrice"
                    type="number"
                    step="0.01"
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableSpaces">Available Spaces *</Label>
                  <Input
                    id="availableSpaces"
                    type="number"
                    value={formData.availableSpaces}
                    onChange={(e) => setFormData({ ...formData, availableSpaces: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="FILLING_FAST">Filling Fast</SelectItem>
                    <SelectItem value="SOLD_OUT">Sold Out</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? "Update" : "Create"} Departure
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {departures.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No departures added yet</p>
            </CardContent>
          </Card>
        ) : (
          departures.map((departure) => (
            <Card key={departure.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-6">
                  <div>
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {new Date(departure.departureDate).toLocaleDateString()} - {new Date(departure.endDate).toLocaleDateString()}
                    </h3>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span>
                        ${departure.discountedPrice || departure.price}
                        {departure.discountedPrice && (
                          <span className="line-through ml-2">${departure.price}</span>
                        )}
                      </span>
                      <span>•</span>
                      <span>{departure.availableSpaces} spaces</span>
                      <span>•</span>
                      <span className={
                        departure.status === "AVAILABLE" ? "text-green-600" :
                        departure.status === "FILLING_FAST" ? "text-orange-600" :
                        departure.status === "SOLD_OUT" ? "text-red-600" :
                        "text-gray-600"
                      }>
                        {departure.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(departure)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(departure.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
