"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, Upload, GripVertical } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { API_BASE } from "@/lib/api";

// We need to fetch the bearer token manually for the direct axios upload if not using our configured api instance
// Or better, use our configured api instance but we need to handle multipart/form-data.

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

interface SortableImageProps {
  url: string;
  onRemove: () => void;
}

function SortableImage({ url, onRemove }: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative aspect-square rounded-lg overflow-hidden border bg-background group"
    >
      <div
        className="absolute top-2 right-2 z-10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-1"
        onClick={(e) => {
          e.stopPropagation(); // Prevent drag start
          onRemove();
        }}
      >
        <X className="h-4 w-4 text-white" />
      </div>
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 cursor-move opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-md p-1"
      >
        <GripVertical className="h-4 w-4 text-white" />
      </div>

      <Image fill src={url} alt="Uploaded image" className="object-cover" />
    </div>
  );
}

export default function ImageUpload({
  value,
  onChange,
  disabled,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true);
        const newUrls: string[] = [];

        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append("file", file);

          // Upload to backend
          // Note: Using fetch or direct axios here to ensure multipart/form-data
          const token = localStorage.getItem("bearer_token");
          const res = await axios.post(`${API_BASE}/api/upload`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: token ? `Bearer ${token}` : "",
            },
          });

          if (res.data.url) {
            newUrls.push(res.data.url);
          }
        }

        onChange([...value, ...newUrls]);
        toast.success("Images uploaded successfully");
      } catch (error) {
        toast.error("Error uploading images");
        console.error(error);
      } finally {
        setIsUploading(false);
      }
    },
    [value, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    disabled: disabled || isUploading,
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = value.indexOf(active.id as string);
      const newIndex = value.indexOf(over.id as string);
      onChange(arrayMove(value, oldIndex, newIndex));
    }
  };

  const handleRemove = (url: string) => {
    onChange(value.filter((current) => current !== url));
  };

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={value} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {value.map((url) => (
              <SortableImage
                key={url}
                url={url}
                onRemove={() => handleRemove(url)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-10 transition-colors cursor-pointer
          flex flex-col items-center justify-center gap-2 text-muted-foreground
          ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }
          ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="p-4 rounded-full bg-muted/50">
          <Upload className="h-6 w-6" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
          </p>
          <p className="text-xs">SVG, PNG, JPG or GIF (max 5MB)</p>
        </div>
      </div>
    </div>
  );
}
