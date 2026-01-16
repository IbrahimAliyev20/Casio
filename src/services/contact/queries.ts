import { queryOptions } from "@tanstack/react-query";
import { getBranches, getContact, getRegions, getSocialMedia, getStores }  from "./api";


const getContactQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["contact"],
        queryFn: () => getContact(locale),
    });
}

const getSocialMediaQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["social-media"],
        queryFn: () => getSocialMedia(locale),
    });
}

const getRegionsQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["regions"],
        queryFn: () => getRegions(locale),
    });
}

const getStoresQuery = (regionId: number, locale: string) => {
    return queryOptions({
        queryKey: ["stores", regionId],
        queryFn: () => getStores(regionId, locale),
    });
}

const getBranchesQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["branches"],
        queryFn: () => getBranches(locale),
    });
}
export { getContactQuery, getSocialMediaQuery, getRegionsQuery, getStoresQuery, getBranchesQuery };