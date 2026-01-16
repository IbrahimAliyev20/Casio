  "use client";

  import { Check, ChevronLeft } from "lucide-react";
  import Image from "next/image";
  import { Button } from "@/components/ui/button";
  import { useQuery } from "@tanstack/react-query";
  import { getOrderDetailsQuery } from "@/services/orders/queries";

  interface OrderDetailsProps {
    orderId?: string;
    onBack?: () => void;
  }

  export default function OrderDetails({ orderId, onBack }: OrderDetailsProps) {
    const { data: orderResponse, isLoading, error } = useQuery({
      ...getOrderDetailsQuery(orderId || ""),
      enabled: !!orderId, 
    });

    if (isLoading) {
      return (
        <div className="bg-white py-6">
          <div className="mb-6">
            <Button
              onClick={onBack}
              className="flex items-center gap-2 text-2xl font-medium text-gray-700 mb-2 hover:text-gray-900 transition-colors bg-transparent border-none hover:bg-transparent cursor-pointer pb-10"
              variant="ghost"
            >
              <ChevronLeft size={20} />
              Sifariş detalları
            </Button>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="border rounded-md p-4">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      );
    }

    if (error || !orderResponse?.data) {
      return (
        <div className="bg-white py-6">
          <div className="mb-6">
            <Button
              onClick={onBack}
              className="flex items-center gap-2 text-2xl font-medium text-gray-700 mb-2 hover:text-gray-900 transition-colors bg-transparent border-none hover:bg-transparent cursor-pointer pb-10"
              variant="ghost"
            >
              <ChevronLeft size={20} />
              Sifariş detalları
            </Button>
          </div>
          <div className="text-center py-8">
            <p className="text-red-500">Sifariş detalları yüklənərkən xəta baş verdi</p>
          </div>
        </div>
      );
    }

    const order = orderResponse.data;

    // Calculate subtotal from order items
    const subtotal = order.order_items.reduce((sum, item) => {
      const itemPrice = parseFloat(item.discount_price || item.price) * item.quantity;
      return sum + itemPrice;
    }, 0);

    // Calculate discount from promocode if exists
    const discountAmount = order.promocode
      ? (subtotal * order.promocode.discount) / 100
      : 0;

    // Get delivery cost
    const deliveryCost = order.delivery_cost ? parseFloat(order.delivery_cost) : 0;

    // Calculate total (using API total_price)
    const total = parseFloat(order.total_price);

    return (
      <div className="bg-white py-6">
        <div className="mb-6">
          <Button
            onClick={onBack}
            className="flex items-center gap-2 text-2xl font-medium text-gray-700 mb-2 hover:text-gray-900 transition-colors bg-transparent border-none hover:bg-transparent cursor-pointer pb-10"
            variant="ghost"
          >
            <ChevronLeft size={20} />
            Sifariş detalları
          </Button>

          <div className="flex gap-6 text-sm text-gray-500">
            <p>
              Sifariş № :
              <span className="text-gray-900 ml-1">{order.order_number}</span>
            </p>
            <p>
              Məhsul sayı :
              <span className="text-gray-900 ml-1">{order.order_items_count} ədəd</span>
            </p>
            {order.delivery_date && (
              <p>
                Təhvil tarixi :
                <span className="text-gray-900 ml-1">{order.delivery_date}</span>
              </p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-4 mb-6">
          {order.order_items.map((item, index) => (
            <div key={item.product.id || index} className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <Image
                    src={item.product.image || item.product.thumb_image || "/images/saat.png"}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="border rounded object-cover"
                  />

                  <div>
                    <h2 className="font-medium text-base mb-3">{item.product.name}</h2>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-base">
                        {parseFloat(item.discount_price || item.price).toFixed(2)} ₼
                        {item.discount_price && parseFloat(item.discount_price) < parseFloat(item.price) && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            {parseFloat(item.price).toFixed(2)} ₼
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        Sifariş: {item.quantity} ədəd
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Check size={16} className="text-blue-600" />
                  <span className="text-blue-600">{order.status?.label || "Təhvil verildi"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
     <div className="border rounded-md p-4 flex  gap-2 mb-2" >
      <span className="font-medium mb-2 ">Qeyd:</span>
      <span className="text-gray-600">{order.note}</span> 
     </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-md p-4 space-y-5">
            <div>
              <h3 className="font-medium mb-2">Əlaqə məlumatları</h3>
              <p className="text-gray-900">{order.full_name}</p>
              <p className="text-gray-600">{order.phone}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Çatdırılma Ünvanı</h3>
              <p className="text-gray-900">{order.address?.city_or_region} {order.address?.address}</p>

            </div>

            {order.address && (order.address.city_or_region || order.address.address) && (
              <div>
                <h3 className="font-medium mb-2">Çatdırılma Ünvanı</h3>
                {order.address?.city_or_region && (
                  <p className="text-gray-900">{order.address.city_or_region}</p>
                )}
                {order.address?.address && (
                  <p className="text-gray-600">{order.address.address}</p>
                )}
              </div>
            )}

            {order.delivery_date && (
              <div>
                <h3 className="font-medium mb-2">Çatdırılma Tarixi</h3>
                <p className="text-gray-600">{order.delivery_date}</p>
              </div>
            )}
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-4">Ödəniş Detalları</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ödəmə üsulu</span>
                <span className="text-gray-900">{order.payment_type?.label || "Məlumat yoxdur"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Ümumi Qiymət</span>
                <span className="text-gray-900">{subtotal.toFixed(2)} ₼</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>Endirim</span>
                  <span>-{discountAmount.toFixed(2)} ₼</span>
                </div>
              )}

              {deliveryCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Çatdırılma</span>
                  <span className="text-gray-900">{deliveryCost.toFixed(2)} ₼</span>
                </div>
              )}

              <hr className="border-gray-200" />

              <div className="flex justify-between font-semibold text-base">
                <span className="text-gray-900">Yekun qiymət</span>
                <span className="text-gray-900">{total.toFixed(2)} ₼</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
