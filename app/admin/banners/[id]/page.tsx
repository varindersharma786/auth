"use client";

import { useParams } from "next/navigation";
import BannerForm from "@/components/dashboard/BannerForm";

export default function EditBannerPage() {
  const { id } = useParams();

  return (
    <div className="p-8">
      <BannerForm id={id as string} />
    </div>
  );
}
