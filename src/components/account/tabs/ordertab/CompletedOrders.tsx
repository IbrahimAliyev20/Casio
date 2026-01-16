"use client";

import React, { Fragment, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCompletedOrdersQuery } from "@/services/orders/queries";
import OrderDetails from "./OrderDetails";
import { Order } from "@/types";

// Helper function to format date label
const getDateLabel = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time for comparison
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return "Bu gün";
  } else if (date.getTime() === yesterday.getTime()) {
    return "Dünən";
  } else {
    // Format as "DD MMMM YYYY" (e.g., "1 oktyabr 2025")
    const months = [
      "yanvar", "fevral", "mart", "aprel", "may", "iyun",
      "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }
};

export default function CompletedOrders() {
  const { data: ordersResponse, isLoading, error } = useQuery(getCompletedOrdersQuery());
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  if (selectedOrderId) {
    return (
      <OrderDetails
        orderId={selectedOrderId}
        onBack={() => setSelectedOrderId(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="flex items-center justify-between border-b px-8 py-6">
          <h1 className="text-2xl font-medium">Tamamlanmış sifarişlər</h1>
          <select className="border rounded-md px-4 py-2 text-sm">
            <option>Bütün tarixlər</option>
          </select>
        </div>
        <div className="px-8 py-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-md p-4">
              <div className="animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white">
        <div className="flex items-center justify-between border-b px-8 py-6">
          <h1 className="text-2xl font-medium">Tamamlanmış sifarişlər</h1>
          <select className="border rounded-md px-4 py-2 text-sm">
            <option>Bütün tarixlər</option>
          </select>
        </div>
        <div className="px-8 py-8 text-center">
          <p className="text-red-500">Sifarişlər yüklənərkən xəta baş verdi</p>
        </div>
      </div>
    );
  }

  const completedOrders = ordersResponse?.data || [];

  if (completedOrders.length === 0) {
    return (
      <div className="bg-white">
        <div className="flex items-center justify-between border-b px-8 py-6">
          <h1 className="text-2xl font-medium">Tamamlanmış sifarişlər</h1>
          <select className="border rounded-md px-4 py-2 text-sm">
            <option>Bütün tarixlər</option>
          </select>
        </div>
        <div className="px-8 py-8 text-center">
          <p className="text-gray-500">Tamamlanmış sifarişiniz yoxdur</p>
        </div>
      </div>
    );
  }

  // Group orders by date label
  const grouped = completedOrders.reduce((acc: Record<string, Order[]>, order: Order) => {
    const dateLabel = getDateLabel(order.order_date);
    if (!acc[dateLabel]) {
      acc[dateLabel] = [];
    }
    acc[dateLabel].push(order);
    return acc;
  }, {});

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between border-b px-8 py-6">
        <h1 className="text-2xl font-medium">Tamamlanmış sifarişlər</h1>

        <select className="border rounded-md px-4 py-2 text-sm">
          <option>Bütün tarixlər</option>
        </select>
      </div>

      <div className="px-8 py-6 space-y-10">
        {Object.keys(grouped).map((group) => (
          <Fragment key={group}>
            <p className="text-sm text-gray-500">{group}</p>

            <div className="space-y-4">
              {grouped[group].map((order: Order) => (
                <div key={order.id} className="border rounded-md">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      {/* Render images side by side */}
                      <div className="flex items-center gap-4">
                        {order.items.map((item, index) => (
                          <Image
                            key={item.id || index}
                            src={item.image || item.thumb_image || "/images/saat.png"}
                            alt={item.name || item.title || "Product"}
                            width={72}
                            height={72}
                            className="border rounded object-cover"
                          />
                        ))}
                      </div>

                      {/* Status and button */}
                      <div className="flex flex-col items-end gap-5">
                        <div className="flex items-center gap-2 text-sm">
                          <Check size={16} />
                          {order.status?.label || "Təhvil verildi"}
                        </div>

                        <Button
                          onClick={() => setSelectedOrderId(order.id.toString())}
                          className="bg-black text-white h-9 px-12 rounded-none text-sm flex items-center gap-2"
                        >
                          Sifariş detalları <ArrowRight size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                
                  <div className="border-t px-4 py-3 text-sm text-gray-600 flex gap-8">
                    <p>
                      Sifariş :
                      <span className="text-gray-900 ml-1">
                        {order.order_items_count} ədəd
                      </span>
                    </p>
                    <p>
                      Sifariş tarixi :
                      <span className="text-gray-900 ml-1">{order.order_date}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
