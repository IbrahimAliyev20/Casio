import { queryOptions } from "@tanstack/react-query";
import { getSliders } from "./api";


const getSlidersQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["sliders"],
        queryFn: () => getSliders(locale),
    });
}

export { getSlidersQuery };