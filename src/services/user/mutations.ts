import { useMutation } from "@tanstack/react-query";
import { createUserAddress, updateUserAddress, deleteUserAddress, updateUserProfile } from "./api";
import { ApiResponse, UserAddressResponse } from "@/types";

interface CreateAddressVariables {
  address_title: string;
  country: string;
  city_or_region: string;
  address: string;
  post_code: string;
}

interface UpdateAddressVariables {
  id: number;
  data: {
    address_title: string;
    country: string;
    city_or_region: string;
    address: string;
    post_code: string;
  };
}

export const useCreateUserAddressMutation = () => {
  return useMutation<ApiResponse<UserAddressResponse>, Error, CreateAddressVariables>({
    mutationFn: (variables) => createUserAddress(variables),
  });
};

export const useUpdateUserAddressMutation = () => {
  return useMutation<ApiResponse<UserAddressResponse>, Error, UpdateAddressVariables>({
    mutationFn: ({ id, data }) => updateUserAddress(id, data),
  });
};

export const useDeleteUserAddressMutation = () => {
  return useMutation<ApiResponse<UserAddressResponse>, Error, number>({
    mutationFn: (id) => deleteUserAddress(id),
  });
};

export const useUpdateUserProfileMutation = () => {
  return useMutation<ApiResponse<UserAddressResponse>, Error, { name: string; email: string; phone: string }>({
    mutationFn: (data) => updateUserProfile(data),
  });
};