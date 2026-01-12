import TourForm from "@/components/dashboard/TourForm";

interface EditTourPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTourPage({ params }: EditTourPageProps) {
  const resolvedParams = await params;
  return (
    <div className="min-h-screen bg-zinc-50/30 dark:bg-black/30">
      <TourForm params={resolvedParams} />
    </div>
  );
}
