import Link from "next/link";

import { logoutAction } from "@/app/actions/logout";
import { requireUser } from "@/lib/session";

export default async function HomePage() {
  const user = await requireUser();

  return (
    <main className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Parameshwari Jewellers Finance</h1>
          <p className="mt-2 text-sm text-slate-600">Welcome, {user.name}. Dashboard placeholder for Milestone 3.</p>
        </div>

        <form action={logoutAction}>
          <button className="h-12 rounded-md border border-slate-300 px-4 text-sm font-medium" type="submit">
            Logout
          </button>
        </form>
      </div>

      <div className="mt-6">
        <Link className="inline-flex h-12 items-center rounded-md bg-amber-700 px-4 text-sm font-medium text-white" href="/customers">
          Go to Customers
        </Link>
      </div>
    </main>
  );
}
