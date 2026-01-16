import { queryOptions } from "@tanstack/react-query";
import { getAbout } from "./api";


const getAboutQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["about"],
        queryFn: () => getAbout(locale),
    });
}

export { getAboutQuery };