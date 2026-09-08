"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** The SSO sequence now lives on the sign-in page so Clay can morph between the two. Old links land here. */
export default function WelcomeRedirect() {
  const router = useRouter();
  useEffect(() => router.replace("/"), [router]);
  return null;
}
