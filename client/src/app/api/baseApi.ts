import {
  BaseQueryApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";
import { router } from "../../router/Routes";
import { LoadingPriority, startLoading, stopLoading } from "../../layouts/uiSlice";
import { clearCurrentUser } from "../../features/user/userSlice";
import { userApi } from "../../features/user/userApi";

type CustomError = | string | {message: string} | {errors: string [], title: string}

const customBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include", // Include credentials (cookies) in requests
});

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

export const baseQueryWithErrorHandling = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: { loadingPriority?: LoadingPriority } = {}
) => {
  const priority = extraOptions.loadingPriority || LoadingPriority.LOW
  api.dispatch(startLoading(priority)); 
  await sleep();
  const result = await customBaseQuery(args, api, extraOptions);
  api.dispatch(stopLoading()); 
  if (result.error) {
    const originalStatus = result.error.status === 'PARSING_ERROR' && result.error.originalStatus 
        ? result.error.originalStatus 
        : result.error.status;
    const responseData = result.error.data as CustomError;
    const isDev = import.meta.env.MODE === "development";
    if (isDev) {
      console.log(result.error);
      console.log(originalStatus, responseData);
    }
    //neu request truoc do bi 401, thuc hien refresh token
    // nếu không có lỗi thì sẽ retry request trước đó
    if (originalStatus === 401) {
      const refresh = await customBaseQuery(
        { url: "/account/refreshToken", method: "POST" },
        api,
        extraOptions
      );
      console.log("refresh", refresh);
      if (!refresh.error) {
        console.log("refresh ok", refresh.data);
        return customBaseQuery(args, api, extraOptions);//retry request trước đó bị 401
      } else {
        console.log("refresh not ok", refresh.data);
        api.dispatch(clearCurrentUser());
        api.dispatch(userApi.util.invalidateTags(["User"]));
        return refresh;
      }
    }
    switch (originalStatus) {
      case 400:
        if (typeof responseData === "string") {
          if (isDev) toast.error(responseData || "Bad request");
        }
        else if ('errors' in responseData) {
          if (isDev) toast.error(responseData.title);
          throw Object.values(responseData.errors).flat().join(', ');
        }
        break;
      case 401:
        if (isDev) toast.error((responseData as string) || "Unauthorized");

        break;
      case 404:
        if (isDev) toast.error((responseData as string) || "Not found");
        router.navigate('/not-found');
        break;
      case 500:
        if (typeof responseData !== "string" && 'message' in responseData) {
          if (isDev) toast.error((responseData.message) || "Server error");
          router.navigate('/server-error', {state: {error: responseData}});
        }
        break;
    }
  }
  return result;
};

// Tham số:
// args: Là tham số bạn gửi đi để xác định endpoint và các parameters cho query. Có thể là URL (string) hoặc là một object kiểu FetchArgs.
//{url: "/products", method: "GET"}
// api: Là context, cung cấp thông tin về dispatch, getState, v.v.
// api = {
//     dispatch: ...,
//     getState: ...,
//     extra: { token: "xyz" },  // Nếu bạn truyền thêm extraOptions
//     endpoint: "fetchProducts",  // Tên endpoint đang được gọi
//     type: "query"  // Loại call: query hay mutation
// }
// extraOptions: Cung cấp các thông tin bổ sung nếu cần (thường dùng cho thêm options tùy chỉnh, chẳng hạn như headers, config,...).
// const extraOptions = {
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// };
