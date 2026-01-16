"use client";

import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getOrdersQuery } from "@/services/orders/queries";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import OrderDetails from "./ordertab/OrderDetails";

export default function Order() {
  const { data: ordersResponse, isLoading, error } = useQuery(getOrdersQuery());
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
      <div className="bg-white px-8 py-6">
        <h1 className="text-2xl font-medium mb-6">Sifarişlərim</h1>
        <div className="space-y-4">
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
      <div className="bg-white px-8 py-6">
        <h1 className="text-2xl font-medium mb-6">Sifarişlərim</h1>
        <div className="text-center py-8">
          <p className="text-red-500">Sifarişlər yüklənərkən xəta baş verdi</p>
        </div>
      </div>
    );
  }

  const orders = ordersResponse?.data || [];

  if (orders.length === 0) {
    return (
      <div className="bg-white px-8 py-6">
        <h1 className="text-2xl font-medium mb-6">Sifarişlərim</h1>
        <div className="text-center py-8">
          <p className="text-gray-500">Hələ sifarişiniz yoxdur</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white px-8 py-6">
      <h1 className="text-2xl font-medium mb-6">Sifarişlərim</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-md"
          >
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
                    {order.status?.label || "Sifariş alındı"}
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
              {order.total_price !== undefined && (
                <p>
                  Ümumi məbləğ:
                  <span className="text-gray-900 ml-1">
                    {order.total_price.toFixed(2)} ₼
                  </span>
                </p>
              )}
              <p>
                Sifariş tarixi:
                <span className="text-gray-900 ml-1">
                  {order.order_date}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
