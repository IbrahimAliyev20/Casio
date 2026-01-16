import { queryOptions } from "@tanstack/react-query";
import {  getCategories } from "./api";


const getCategoriesQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["categories"],
        queryFn: () => getCategories(locale),
    });
}

export { getCategoriesQuery };