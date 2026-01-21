"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Bed, Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface RoomOption {
  id: string;
  roomType: string;
  description?: string;
  priceAdd: number;
  isDefault: boolean;
}

const ROOM_TYPES = [
  { value: "TWIN_SHARE", label: "Twin Share" },
  { value: "SINGLE_ROOM", label: "Single Room" },
  { value: "DOUBLE_ROOM", label: "Double Room" },
  { value: "TRIPLE_ROOM", label: "Triple Room" },
  { value: "DORMITORY", label: "Dormitory" },
];

export default function TourRoomOptionsPage() {
  const params = useParams();
  const tourId = params?.id as string;

  const [roomOptions, setRoomOptions] = useState<RoomOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    roomType: "TWIN_SHARE",
    description: "",
    priceAdd: "",
    isDefault: false,
  });

  useEffect(() => {
    if (tourId) {
      fetchRoomOptions();
    }
  }, [tourId]);

  const fetchRoomOptions = async () => {
    try {
      const { data } = await api.get(`/api/room-options/tour/${tourId}`);
      setRoomOptions(data);
    } catch (error) {
      console.error("Failed to fetch room options:", error);
      toast.error("Failed to load room options");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      tourId,
      roomType: formData.roomType,
      description: formData.description || null,
      priceAdd: parseFloat(formData.priceAdd) || 0,
      isDefault: formData.isDefault,
    };

    try {
      if (editingId) {
        await api.put(`/api/room-options/${editingId}`, payload);
        toast.success("Room option updated successfully");
      } else {
        await api.post("/api/room-options", payload);
        toast.success("Room option created successfully");
      }
      
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchRoomOptions();
    } catch (error) {
      console.error("Failed to save room option:", error);
      toast.error("Failed to save room option");
    }
  };

  const handleEdit = (roomOption: RoomOption) => {
    setFormData({
      roomType: roomOption.roomType,
      description: roomOption.description || "",
      priceAdd: roomOption.priceAdd.toString(),
      isDefault: roomOption.isDefault,
    });
    setEditingId(roomOption.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room option?")) return;
    
    try {
      await api.delete(`/api/room-options/${id}`);
      toast.success("Room option deleted successfully");
      fetchRoomOptions();
    } catch (error) {
      console.error("Failed to delete room option:", error);
      toast.error("Failed to delete room option");
    }
  };

  const resetForm = () => {
    setFormData({
      roomType: "TWIN_SHARE",
      description: "",
      priceAdd: "",
      isDefault: false,
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
          <h1 className="text-3xl font-bold">Room Options</h1>
          <p className="text-muted-foreground">Manage room types and pricing supplements</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowForm(!showForm);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Room Option
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit" : "Add"} Room Option</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type *</Label>
                <Select value={formData.roomType} onValueChange={(value) => setFormData({ ...formData, roomType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Private room with ensuite bathroom"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceAdd">Additional Price (USD)</Label>
                <Input
                  id="priceAdd"
                  type="number"
                  step="0.01"
                  value={formData.priceAdd}
                  onChange={(e) => setFormData({ ...formData, priceAdd: e.target.value })}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">
                  Extra charge for this room type (0 for no additional cost)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked as boolean })}
                />
                <Label htmlFor="isDefault" className="font-normal cursor-pointer">
                  Set as default room option
                </Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? "Update" : "Create"} Room Option
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
        {roomOptions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bed className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No room options added yet</p>
            </CardContent>
          </Card>
        ) : (
          roomOptions.map((roomOption) => (
            <Card key={roomOption.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-6">
                  <div>
                    <Bed className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {ROOM_TYPES.find((t) => t.value === roomOption.roomType)?.label}
                      {roomOption.isDefault && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {roomOption.description || "No description"}
                    </p>
                    <p className="text-sm font-semibold mt-2">
                      {roomOption.priceAdd > 0 ? `+$${roomOption.priceAdd}` : "Included in price"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(roomOption)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(roomOption.id)}
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
