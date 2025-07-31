import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseApi";
import { NotificationGroup } from "../../lib/types";

export const notificationGroupApi = createApi({
    baseQuery: baseQueryWithErrorHandling,
    reducerPath: "notificationGroupApi",
    tagTypes: ["NotificationGroup"],
    endpoints: (builder) => ({
        fetchNotificationGroups: builder.query<NotificationGroup[], void>({
            query: () => ({
                url: "/notificationgroup",
                method: "GET"
            })
        })
    })
})

export const { useFetchNotificationGroupsQuery } = notificationGroupApi