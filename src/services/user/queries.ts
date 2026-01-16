import { queryOptions } from "@tanstack/react-query";
import { getUserAddresses, getUserProfile } from "./api";

const getUserAddressesQuery = (locale: string) => {
  return queryOptions({
    queryKey: ["user-addresses"],
    queryFn: () => getUserAddresses(locale),
  });
};

const getUserProfileQuery = () => {
  return queryOptions({
    queryKey: ["user-profile"],
    queryFn: () => getUserProfile(),
  });
};

export { getUserAddressesQuery, getUserProfileQuery };