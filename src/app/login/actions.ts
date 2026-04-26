"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createSessionToken, getSessionCookieOptions } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=Please%20enter%20email%20and%20password.");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    redirect("/login?error=Invalid%20email%20or%20password.");
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    redirect("/login?error=Invalid%20email%20or%20password.");
  }

  const token = createSessionToken(user.id);
  const cookieOptions = getSessionCookieOptions();

  const cookieStore = await cookies();
  cookieStore.set(cookieOptions.name, token, cookieOptions);

  redirect("/");
}
