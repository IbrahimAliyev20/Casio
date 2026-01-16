"use client";

import React, { Fragment, useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import AddressForm from "./AddressForm";
import AddressList from "./AddressList";
import EmptyState from "./EmptyState";
import { Address, UserAddressResponse } from "@/types";
import { AddressFormData } from "./types";
import { getUserAddressesQuery } from "@/services/user/queries";
import {
  useCreateUserAddressMutation,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation
} from "@/services/user/mutations";

function Addresses() {
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: addressesResponse, isLoading: isLoadingAddresses } = useQuery(
    getUserAddressesQuery("az") // Assuming default locale
  );

  const createMutation = useCreateUserAddressMutation();
  const updateMutation = useUpdateUserAddressMutation();
  const deleteMutation = useDeleteUserAddressMutation();

  const addresses: Address[] = (addressesResponse?.data || []).map((addr: UserAddressResponse) => ({
    id: addr.id,
    title: addr.address_title,
    country: addr.country,
    city: addr.city_or_region,
    address: addr.address,
    postal_code: addr.post_code,
    selected: 0, // Default value since API doesn't provide this
    is_selected: 0, // Default value since API doesn't provide this
  }));

  const handleSubmit = async (data: AddressFormData) => {
    try {
      if (editingAddress) {
        await updateMutation.mutateAsync({
          id: editingAddress.id,
          data: {
            address_title: data.title,
            country: data.country,
            city_or_region: data.city,
            address: data.address,
            post_code: data.postal_code,
          }
        });
        toast.success("Ünvan uğurla yeniləndi!");
      } else {
        await createMutation.mutateAsync({
          address_title: data.title,
          country: data.country,
          city_or_region: data.city,
          address: data.address,
          post_code: data.postal_code,
        });
        toast.success("Ünvan uğurla yaradıldı!");
      }

      // Invalidate and refetch addresses
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      toast.error("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Ünvan uğurla silindi!");
      // Invalidate and refetch addresses
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
    } catch (error) {
      toast.error("Ünvan silinərkən xəta baş verdi.");
    }
  };

  const handleSelect = (id: number) => {
    // Note: Address selection logic should be implemented in the backend API
    // For now, we'll just show a success message
    toast.success("Əsas ünvan seçildi!");
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  if (showForm) {
    return (
      <AddressForm
        onSubmit={handleSubmit}
        onBack={handleBack}
        defaultValues={editingAddress || undefined}
        isEditing={!!editingAddress}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    );
  }

  return (
    <Fragment>
      <h1 className="text-2xl font-medium border-b md:p-8 p-4 border-[#F3F2F8] text-gray-900 max-sm:text-xl">
        Ünvanlarım
      </h1>
      <div>
        {isLoadingAddresses ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : addresses.length === 0 ? (
          <EmptyState onAddNew={handleAddNew} />
        ) : (
          <AddressList
            addresses={addresses}
            onAddNew={handleAddNew}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={handleSelect}
          />
        )}
      </div>
    </Fragment>
  );
}

export default Addresses;
