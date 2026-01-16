"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { addressSchema, AddressFormData } from "./types";
import { Address } from "@/types";

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  onBack: () => void;
  defaultValues?: Address | AddressFormData;
  isEditing?: boolean;
  isLoading?: boolean;
}

export default function AddressForm({
  onSubmit,
  onBack,
  defaultValues,
  isEditing,
  isLoading,
}: AddressFormProps) {
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues || {
      country: "",
      city: "",
      title: "",
      address: "",
    },
  });

  const control = form.control as Control<AddressFormData>;

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <button onClick={onBack}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-medium">
          {isEditing ? "Ünvanı düzəlt" : "Ünvan əlavə et"}
        </h1>
      </div>

      <div className="px-4 py-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ölkə</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ölkənizi daxil edin"
                      className="h-14 rounded-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şəhər / Rayon</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Şəhər və ya rayonu daxil edin"
                      className="h-14 rounded-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ünvan başlığı</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ünvan başlığını daxil edin"
                      className="h-14 rounded-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ünvan</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ünvanı daxil edin"
                      className="h-14 rounded-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={control}
              name="postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poçt indeksi</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Poçt indeksini daxil edin"
                      className="h-14 rounded-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gray-400 hover:bg-gray-400 text-white h-12 px-8 rounded-none"
              >
                {isLoading ? "Yadda saxlanılır..." : "Yadda saxla"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
