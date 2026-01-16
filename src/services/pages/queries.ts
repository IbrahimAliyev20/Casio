import { queryOptions } from "@tanstack/react-query";
import { getPrivacyPolicy, getTermsOfService, getFaq } from "./api";

const getPrivacyPolicyQuery = () => {
    return queryOptions({
        queryKey: ["privacy-policy"],
        queryFn: () => getPrivacyPolicy(),
    });
}

const getTermsOfServiceQuery = () => {
    return queryOptions({
        queryKey: ["terms-of-service"],
        queryFn: () => getTermsOfService(),
    });
}

const getFaqQuery = () => {
    return queryOptions({
        queryKey: ["faq"],
        queryFn: () => getFaq(),
    });
}

export { getPrivacyPolicyQuery, getTermsOfServiceQuery, getFaqQuery };
