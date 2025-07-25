"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { IMAGE_VARIANTS } from "@/models/Product";

export default function SalesPage() {
  const { data: session } = useSession();
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch("/api/sales");
        const data = await res.json();
        setSales(data);
      } catch (err) {
        console.error("Error fetching sales:", err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === "seller") {
      fetchSales();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Sales Overview</h1>

      {sales.length === 0 ? (
        <p className="text-base-content/70">No sales yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {sales.map((order, idx) => {
            const variantKey = (order.variant?.type || "SQUARE").toUpperCase() as keyof typeof IMAGE_VARIANTS;
            const variant = IMAGE_VARIANTS[variantKey];

            return (
              <div
                key={order._id || idx}
                className="bg-base-200 p-4 rounded-md shadow flex flex-col gap-2 max-w-4xl"
              >
                <h2 className="text-lg font-semibold text-base-content">
                  {order.productId?.name || "Untitled Product"}
                </h2>

                <p className="text-sm text-base-content/70">
                  Sold to: <span className="font-medium">{order.userId?.email}</span>
                </p>

                <p className="text-sm text-base-content/70">
                  Variant: <span className="font-medium">{order.variant?.type}</span> — License: <span className="font-medium">{order.variant?.license}</span>
                </p>

                <p className="text-sm text-base-content/70">
                  Resolution: {variant.dimensions.width}×{variant.dimensions.height}px
                </p>

                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-primary">
                    ₹{order.amount?.toFixed(2)}
                  </span>
                  <span
                    className={`badge ${
                      order.status === "completed"
                        ? "badge-success"
                        : order.status === "failed"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
