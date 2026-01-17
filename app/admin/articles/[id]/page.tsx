"use client";

import { useParams } from "next/navigation";
import ArticleForm from "@/components/dashboard/ArticleForm";

export default function EditArticlePage() {
  const { id } = useParams();

  return (
    <div className="p-8">
      <ArticleForm id={id as string} />
    </div>
  );
}
