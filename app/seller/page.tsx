"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminProductForm from "../components/AdminProductForm";
import { useEffect } from "react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "seller") {
      router.push("/"); // redirect if not seller
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="text-center mt-10">Loading...</div>; // prevent hydration error
  }

  if (!session || session.user.role !== "seller") {
    return null; // prevent flash
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
        <AdminProductForm />
      </div>
    </div>
  );
}