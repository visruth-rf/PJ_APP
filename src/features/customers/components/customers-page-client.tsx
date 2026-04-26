"use client";

import { useEffect, useMemo, useState } from "react";

type CustomerListItem = {
  id: string;
  customerId: string;
  name: string;
  phone: string;
  createdAt: string;
};

type ApiError = {
  message: string;
};

export function CustomersPageClient() {
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchQuery = useMemo(() => search.trim(), [search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadCustomers(searchQuery);
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  async function loadCustomers(currentSearch: string) {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const url = currentSearch ? `/api/customers?search=${encodeURIComponent(currentSearch)}` : "/api/customers";
      const response = await fetch(url, { method: "GET" });
      const data = (await response.json()) as { customers?: CustomerListItem[] } & ApiError;

      if (!response.ok) {
        throw new Error(data.message || "Unable to load customers");
      }

      setCustomers(data.customers ?? []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load customers");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddCustomer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formName,
          phone: formPhone
        })
      });

      const data = (await response.json()) as { customer?: CustomerListItem } & ApiError;

      if (!response.ok || !data.customer) {
        throw new Error(data.message || "Unable to add customer");
      }

      setFormName("");
      setFormPhone("");
      setIsModalOpen(false);

      setToastMessage(`Customer added successfully. Customer ID: ${data.customer.customerId}`);
      setTimeout(() => setToastMessage(null), 4000);

      void loadCustomers(searchQuery);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to add customer");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <button
          className="h-12 rounded-md bg-amber-700 px-4 text-sm font-medium text-white"
          onClick={() => setIsModalOpen(true)}
          type="button"
        >
          + Add Customer
        </button>
      </div>

      <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="search">
        Search by name, phone, or Customer ID
      </label>
      <input
        id="search"
        className="h-12 w-full rounded-md border border-slate-300 px-3 text-base"
        placeholder="Ramesh Kumar, 9876543210, or RAME3210"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {toastMessage ? <p className="mt-3 rounded-md bg-green-50 p-3 text-sm text-green-700">{toastMessage}</p> : null}
      {errorMessage ? <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p> : null}

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
        <div className="grid grid-cols-3 gap-2 bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
          <span>Name</span>
          <span>Phone</span>
          <span>Customer ID</span>
        </div>

        {isLoading ? <p className="px-3 py-4 text-sm text-slate-600">Loading customers...</p> : null}

        {!isLoading && customers.length === 0 ? (
          <p className="px-3 py-4 text-sm text-slate-600">No customers found. Add your first customer.</p>
        ) : null}

        {!isLoading
          ? customers.map((customer) => (
              <div
                key={customer.id}
                className="grid min-h-12 grid-cols-3 items-center gap-2 border-t border-slate-200 px-3 py-3 text-sm"
              >
                <span className="font-medium text-slate-900">{customer.name}</span>
                <span className="text-slate-700">{customer.phone}</span>
                <span className="font-mono text-slate-700">{customer.customerId}</span>
              </div>
            ))
          : null}
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">Add Customer</h2>
            <p className="mt-1 text-sm text-slate-600">Enter customer name and 10-digit phone number.</p>

            <form className="mt-4 space-y-3" onSubmit={handleAddCustomer}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="name">
                  Customer Name
                </label>
                <input
                  id="name"
                  className="h-12 w-full rounded-md border border-slate-300 px-3 text-base"
                  value={formName}
                  onChange={(event) => setFormName(event.target.value)}
                  placeholder="Ramesh Kumar"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  className="h-12 w-full rounded-md border border-slate-300 px-3 text-base"
                  value={formPhone}
                  onChange={(event) => setFormPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="9876543210"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  className="h-12 flex-1 rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700"
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="h-12 flex-1 rounded-md bg-amber-700 px-4 text-sm font-medium text-white disabled:opacity-60"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Saving..." : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
