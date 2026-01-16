import { get, post } from "@/lib/api";
import { ApiResponse, UserAddressResponse } from "@/types";


const getUserProfile = async () => {
  const response = await get<ApiResponse<UserAddressResponse>>(
    "/get-user"
  );
  return response;
};


const getUserAddresses = async (locale?: string) => {
  const response = await get<ApiResponse<UserAddressResponse[]>>(
    "/user-addresses",
    { locale }
  );
  return response;
};
const createUserAddress = async (data: {
  address_title: string;
  country: string;
  city_or_region: string;
  address: string;
  post_code: string;
}) => {
  const response = await post<ApiResponse<UserAddressResponse>>(
    "/user-address/store",
    data
  );
  return response;
};

const updateUserAddress = async (id: number, data: {
  address_title: string;
  country: string;
  city_or_region: string;
  address: string;
  post_code: string;
}) => {
  const response = await post<ApiResponse<UserAddressResponse>>(
    `/user-address/update/${id}`,
    data
  );
  return response;
};
const deleteUserAddress = async (id: number) => {
  const response = await post<ApiResponse<UserAddressResponse>>(
    `/user-address/delete/${id}`
  );
  return response;
};


const updateUserProfile = async (data: {
  name: string;
  email: string;
  phone: string;
}) => {
  const response = await post<ApiResponse<UserAddressResponse>>(
    "/update",
    data
  );
  return response;
};
export {
  getUserProfile,
  getUserAddresses,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
  updateUserProfile,
};
