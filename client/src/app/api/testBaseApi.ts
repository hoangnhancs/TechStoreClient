import { BaseQueryApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { LoadingPriority } from "../../layouts/uiSlice";
import { toast } from "react-toastify";

type CustomError = string | {message: string} | {errors: string[], title: string}

const customBaseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:3000",
    credentials: "include",
})

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

export const baseQueryWithErrorHandling = async (
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: {loadingPriority?: LoadingPriority}
) => {
    const result = await customBaseQuery(args, api, extraOptions)
    sleep();
    if (result.error) {
        const errorCode = result.error.status === "PARSING_ERROR" && result.error.originalStatus ? result.error.originalStatus : result.error.status;
        if (errorCode === 401) {
            const refreshResult = await customBaseQuery({ url: "/account/refreshToken", method: "POST" }, api, extraOptions);
            if (!refreshResult.error && api.endpoint !== "refreshToken") {
                return await customBaseQuery(args, api, extraOptions);
            } else {
                return refreshResult
            }
        }
        const errorData = result.error.data as CustomError

        switch (errorCode) {
            case 400:
                if (typeof errorData === 'string'){
                    toast.error(errorData)
                } else if ('errors' in errorData) {
                    toast.error(errorData.errors.join(', '));
                    throw Object.values(errorData.errors)
                } else if ('message' in errorData) {
                    toast.error(errorData.message);
                }
                break;
            
        }
    }
    return result
}