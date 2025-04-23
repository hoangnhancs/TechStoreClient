import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterReducer from "../../features/counter/counterSlice";
import { productApi } from "../../features/products/productApi";
import uiReducer from "../../layouts/uiSlice";
import { errorApi } from "../../features/error/errorApi";
import { basketApi } from "../../features/basket/basketApi";
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
import storage from "redux-persist/lib/storage"; 
import { orderApi } from "../../features/order/orderApi";

const persistConfig = {
  key: "root", // key để lưu trong localStorage
  storage,
  whitelist: ["basket"], // Chỉ persist slice basket
  // blacklist: [] // Loại trừ các reducers không muốn persist
};

const rootReducer = combineReducers({
  [productApi.reducerPath]: productApi.reducer,
  [errorApi.reducerPath]: errorApi.reducer,
  [basketApi.reducerPath]: basketApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  counter: counterReducer,
  ui: uiReducer,
  basket: basketReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      productApi.middleware,
      errorApi.middleware,
      basketApi.middleware,
      userApi.middleware,
      orderApi.middleware,
    ), //thêm middleware cho productApi vào store
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
