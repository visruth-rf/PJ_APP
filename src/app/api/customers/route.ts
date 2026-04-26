import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/session";
import { createCustomerSchema, searchCustomersSchema } from "@/features/customers/schemas";
import { createCustomer, searchCustomers } from "@/features/customers/service";

export async function GET(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsedQuery = searchCustomersSchema.safeParse({
    search: searchParams.get("search") ?? undefined
  });

  if (!parsedQuery.success) {
    return NextResponse.json({ message: parsedQuery.error.issues[0]?.message ?? "Invalid search query" }, { status: 400 });
  }

  const customers = await searchCustomers(parsedQuery.data.search);

  return NextResponse.json({ customers });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const requestJson: unknown = await request.json();
  const parsedBody = createCustomerSchema.safeParse(requestJson);

  if (!parsedBody.success) {
    return NextResponse.json({ message: parsedBody.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  try {
    const customer = await createCustomer(parsedBody.data);
    return NextResponse.json({ customer }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Unable to create customer" }, { status: 500 });
  }
}
