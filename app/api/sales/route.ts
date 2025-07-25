import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Order from "@/models/Order";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "seller") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await Order.find()
    .populate({
      path: "productId",
      select: "name imageUrl seller",
    })
    .populate({
      path: "userId",
      select: "email",
    })
    .lean(); // ✅ ensures populated objects are accessible

  const sellerOrders = orders.filter(
    (order: any) =>
      order.productId?.seller?.toString() === session.user.id
  );

  return NextResponse.json(sellerOrders);
}
