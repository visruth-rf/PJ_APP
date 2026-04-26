import { requireUser } from "@/lib/session";

export default async function CustomersPage() {
  await requireUser();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Customers</h1>
      <p className="mt-2 text-sm text-slate-600">Customers page placeholder for Milestone 2.</p>
    </main>
  );
}
