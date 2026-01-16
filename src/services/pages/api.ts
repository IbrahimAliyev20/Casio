import { get } from "@/lib/api";
import {
  ApiResponse,
  FaqResponse,
  PrivacyPolicyResponse,
  TermsOfServiceResponse,
} from "@/types";

const getPrivacyPolicy = async () => {
  const response = await get<ApiResponse<PrivacyPolicyResponse>>(
    "/pages/mexfilik-siyaseti"
  );
  return response;
};
const getTermsOfService = async () => {
  const response = await get<ApiResponse<TermsOfServiceResponse>>(
    "/pages/istifade-sertleri-ve-qaydalari"
  );
  return response;
};
const getFaq = async () => {
  const response = await get<ApiResponse<FaqResponse[]>>("/faqs");
  return response;
};

export { getPrivacyPolicy, getTermsOfService, getFaq };
