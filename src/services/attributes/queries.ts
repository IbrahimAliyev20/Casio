import { queryOptions } from "@tanstack/react-query";
import { getAttributes } from "./api";


const getAttributesQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["attributes"],
        queryFn: () => getAttributes(locale),
    });
}

export { getAttributesQuery };
