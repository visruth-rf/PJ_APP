import { CustomersPageClient } from "@/features/customers/components/customers-page-client";
import { requireUser } from "@/lib/session";

export default async function CustomersPage() {
  await requireUser();

  return <CustomersPageClient />;
}
