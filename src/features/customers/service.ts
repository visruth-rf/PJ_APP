import { Prisma } from "@prisma/client";

import { generateBaseCustomerId, resolveCustomerIdCollision } from "@/lib/customer-id";
import { prisma } from "@/lib/prisma";
import { type CreateCustomerInput } from "@/features/customers/schemas";

export type CustomerListItem = {
  id: string;
  customerId: string;
  name: string;
  phone: string;
  createdAt: string;
};

function toCustomerListItem(customer: {
  id: string;
  customerId: string;
  name: string;
  phone: string;
  createdAt: Date;
}): CustomerListItem {
  return {
    id: customer.id,
    customerId: customer.customerId,
    name: customer.name,
    phone: customer.phone,
    createdAt: customer.createdAt.toISOString()
  };
}

async function buildUniqueCustomerId(name: string, phone: string) {
  const baseId = generateBaseCustomerId(name, phone);

  const matchingIds = await prisma.customer.findMany({
    where: {
      customerId: {
        startsWith: baseId
      }
    },
    select: {
      customerId: true
    }
  });

  return resolveCustomerIdCollision(
    baseId,
    new Set<string>(matchingIds.map((record) => record.customerId))
  );
}

export async function createCustomer(input: CreateCustomerInput) {
  const customerId = await buildUniqueCustomerId(input.name, input.phone);

  try {
    const customer = await prisma.customer.create({
      data: {
        name: input.name,
        phone: input.phone,
        customerId
      },
      select: {
        id: true,
        customerId: true,
        name: true,
        phone: true,
        createdAt: true
      }
    });

    return toCustomerListItem(customer);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("A customer with this phone number already exists.");
    }

    throw error;
  }
}

export async function searchCustomers(search?: string) {
  const term = search?.trim();

  const customers = await prisma.customer.findMany({
    where: term
      ? {
          OR: [
            {
              name: {
                contains: term,
                mode: "insensitive"
              }
            },
            {
              phone: {
                contains: term
              }
            },
            {
              customerId: {
                contains: term,
                mode: "insensitive"
              }
            }
          ]
        }
      : undefined,
    orderBy: [
      {
        createdAt: "desc"
      }
    ],
    take: 50,
    select: {
      id: true,
      customerId: true,
      name: true,
      phone: true,
      createdAt: true
    }
  });

  return customers.map(toCustomerListItem);
}
