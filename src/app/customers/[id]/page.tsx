interface CustomerPageProps {
  params: { id: string };
}

export default function CustomerProfilePage({ params }: CustomerPageProps) {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Customer Profile</h1>
      <p className="mt-2 text-sm text-slate-600">Customer ID: {params.id}</p>
    </main>
  );
}
