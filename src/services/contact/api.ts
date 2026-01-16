import { get } from "@/lib/api";
import { ApiResponse, ContactResponse, RegionResponse, SocialMediaResponse, StoreResponse } from "@/types";

const getContact = async (locale?: string) => {
  const response = await get<ApiResponse<ContactResponse>>("/contacts", {
    locale,
  });
  return response;
};

const getSocialMedia = async (locale?: string) => {
  const response = await get<ApiResponse<SocialMediaResponse[]>>(
    "/social-media",
    { locale }
  );
  return response;
};
const getRegions = async (locale?: string) => {
  const response = await get<ApiResponse<RegionResponse[]>>(
    "/regions",
    { locale }
  );
  return response;
};

const getStores = async (regionId: number, locale?: string) => {
  const response = await get<ApiResponse<StoreResponse[]>>(
    `/region-stores/${regionId}`,
    { locale }
  );
  return response;
};

const getBranches = async (locale?: string) => {
  const response = await get<ApiResponse<StoreResponse[]>>(
    "/stores",
    { locale }
  );
  return response;
};

export { getContact, getSocialMedia, getRegions, getStores, getBranches };
