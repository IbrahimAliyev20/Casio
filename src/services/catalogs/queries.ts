import { queryOptions } from "@tanstack/react-query";
import { getCatalogs } from "./api";


const getCatalogsQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["catalogs"],
        queryFn: () => getCatalogs(locale),
    });
}

export { getCatalogsQuery };