import { redirect } from "next/navigation";

import { loginAction } from "@/app/login/actions";
import { getCurrentUser } from "@/lib/session";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: {
    error?: string;
  };
}) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-8">
      <form action={loginAction} className="w-full space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Admin Login</h1>
        <p className="text-sm text-slate-600">Use your admin email and password to continue.</p>

        <label className="block text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          className="h-12 w-full rounded-md border border-slate-300 px-3 text-base"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />

        <label className="block text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <input
          className="h-12 w-full rounded-md border border-slate-300 px-3 text-base"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />

        {searchParams?.error ? <p className="text-sm font-medium text-red-600">{searchParams.error}</p> : null}

        <button className="h-12 w-full rounded-md bg-amber-700 px-4 text-base font-medium text-white" type="submit">
          Login
        </button>
      </form>
    </main>
  );
}
