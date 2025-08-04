/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    BaseQueryApi,
    
    fetchBaseQuery,
} from "@reduxjs/toolkit/query";
import { LoadingPriority, startLoading, stopLoading } from "../../layouts/uiSlice";
import { clearCurrentUser } from "../../features/user/userSlice";
import { toast } from "react-toastify";
import { router } from "../../router/Routes";

type GraphQLRequestArgs = {
    document: string; // Câu query hoặc mutation
    variables?: Record<string, any>; // Biến truyền vào query
    operationName?: string; // Tên operation nếu có
};

type GraphQLError = {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: Record<string, any>;
};

type GraphQLResponse<T = any> = {
  data?: T;
  errors?: GraphQLError[];
};

const customBaseApiQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include", // Include credentials (cookies) in requests
});

const customBaseGraphqlQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_GRAPHQL_URL,
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
    },
});

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

export const baseGraphqlQueryWithErrorHandling = async (
    args: GraphQLRequestArgs,
    api: BaseQueryApi,
    extraOptions: { loadingPriority?: LoadingPriority } = {}
) => {
    const priority = extraOptions.loadingPriority || LoadingPriority.LOW;
    api.dispatch(startLoading(priority));
    await sleep();
    const graphqlArgs = {
        url: "",
        method: "POST",
        body: {
            query: args.document,
            variables: args.variables ?? {},
        },
        headers: {
            "Content-Type": "application/json",
        },
    };
    const result = await customBaseGraphqlQuery(graphqlArgs, api, extraOptions);
    api.dispatch(stopLoading());

    const isDev = import.meta.env.MODE === "development";
    const originalStatus =
      result.error?.status === "PARSING_ERROR" && result.error.originalStatus
        ? result.error.originalStatus
        : result.error?.status;

    if (originalStatus === 401) {
        const refresh = await customBaseApiQuery(
          { url: "/account/refreshToken", method: "POST" },
          api,
          extraOptions
        );
        if (!refresh.error && api.endpoint !== "refreshToken") {
            console.log("refresh ok", refresh.data);
            return customBaseGraphqlQuery(graphqlArgs, api, extraOptions); //retry request trước đó bị 401
        } else {
            console.log("refresh not ok", refresh.data);
            api.dispatch(clearCurrentUser());
            return refresh;
        }     
    }
    const data = (result.data ?? {}) as GraphQLResponse;
    const graphQLError = data.errors?.[0] ?? result.error?.data;
    let message = "Unknown error";
    if (typeof graphQLError === "string") {
        message = graphQLError;
    } else if (
        typeof graphQLError === "object" &&
        graphQLError !== null &&
        "message" in graphQLError
    ) {
        message = (graphQLError as GraphQLError).message;
    }

    if (isDev && result.error) {
        console.log("GraphQL Error:", result.error);
    }

    if (result.error) {
        switch (originalStatus) {
            case 400:
                toast.error(message || "Bad request");
                break;
            case 401:
                if (isDev) toast.error("Unauthorized");
                break;
            case 404:
                toast.error("Not found");
                router.navigate("/not-found");
                break;
            case 500:
                toast.error("Server error");
                router.navigate("/server-error", { state: { error: graphQLError } });
            break;
            default:
            toast.error(message);
        }
    } else if (data.errors?.length) {
        toast.error(message);
    }

    return result;
};
