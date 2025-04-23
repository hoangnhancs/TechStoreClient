import {
  BaseQueryApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../../layouts/uiSlice";
import { toast } from "react-toastify";
import { router } from "../../router/Routes";

type CustomError = | string | {message: string} | {errors: string [], title: string}

const customBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include", // Include credentials (cookies) in requests
});

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

export const baseQueryWithErrorHandling = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  api.dispatch(startLoading()); //start loading

  await sleep();
  const result = await customBaseQuery(args, api, extraOptions);

  api.dispatch(stopLoading()); //stop loading
  if (result.error) {
    
    const originalStatus = result.error.status === 'PARSING_ERROR' && result.error.originalStatus 
        ? result.error.originalStatus 
        : result.error.status;
    const responseData = result.error.data as CustomError
    //handle error
    console.log(result.error);
    console.log(originalStatus, responseData);
    switch (originalStatus) {
        case 400:
            if (typeof responseData === "string")
                toast.error(responseData || "Bad request c");
            else if ('errors' in responseData) {
                toast.error(responseData.title)
                throw Object.values(responseData.errors).flat().join(', ')       
            }
            break
        case 401:
            toast.error((responseData as string) || "Unauthorized c");
            break
        case 404:
            toast.error((responseData as string) || "Not found c");
            router.navigate('/not-found')
            break
        case 500:
            if (typeof responseData !== "string" && 'message' in responseData)
                toast.error((responseData.message ) || "Server error c");
                router.navigate('/server-error', {state: {error: responseData}})
            break
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
