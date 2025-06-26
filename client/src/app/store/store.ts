import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterReducer from "../../features/counter/counterSlice";
import { productApi } from "../api/productApi";
import uiReducer from "../../layouts/uiSlice";

import { userApi } from "../../features/user/userApi";
import basketReducer from "../../features/basket/basketSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storageSession from "redux-persist/lib/storage/session";
import { errorApi } from "../api/errorApi";
import { basketApi } from "../api/basketApi";
import { orderApi } from "../api/orderApi";
import { paymentApi } from "../api/paymentApi";
import { addressApi } from "../api/addressApi";
import { filterTagValueApi } from "../api/filterTagValueApi";
import { filterTagApi } from "../api/filterTagApi";
import filterReducer from "../../features/filter/filterSlice";

const persistConfig = {
  key: "root", // key để lưu trong localStorage
  storage: storageSession,
  whitelist: ["basket", "filter"], // Chỉ persist slice basket
  // blacklist: [] // Loại trừ các reducers không muốn persist
};
const middlewares = [
  productApi.middleware,
  errorApi.middleware,
  basketApi.middleware,
  userApi.middleware,
  orderApi.middleware,
  paymentApi.middleware,
  addressApi.middleware,
  filterTagValueApi.middleware,
  filterTagApi.middleware,
];

const rootReducer = combineReducers({
  [productApi.reducerPath]: productApi.reducer,
  [errorApi.reducerPath]: errorApi.reducer,
  [basketApi.reducerPath]: basketApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [addressApi.reducerPath]: addressApi.reducer,
  [filterTagValueApi.reducerPath]: filterTagValueApi.reducer,
  [filterTagApi.reducerPath]: filterTagApi.reducer,
  counter: counterReducer,
  ui: uiReducer,
  basket: basketReducer,
  filter: filterReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(...middlewares), //thêm middleware cho productApi vào store
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
