import { requireUser } from "@/lib/session";

export default async function CustomerDetailPage({
  params
}: {
  params: {
    id: string;
  };
}) {
  await requireUser();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Customer Profile</h1>
      <p className="mt-2 text-sm text-slate-600">Customer ID: {params.id}</p>
      <p className="mt-2 text-sm text-slate-600">Customer profile placeholder for Milestone 2.</p>
    </main>
  );
}
