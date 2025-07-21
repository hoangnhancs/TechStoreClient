import { configureStore, combineReducers } from "@reduxjs/toolkit";

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
import { createAction } from "@reduxjs/toolkit";

// Local reducers
import counterReducer from "../../features/counter/counterSlice";
import uiReducer from "../../layouts/uiSlice";
import basketReducer from "../../features/basket/basketSlice";
import filterReducer from "../../features/filter/filterSlice";
import authReducer from "../slice/authSlice";
import userReducer from "../../features/user/userSlice";
import orderReducer from "../../features/order/orderSlice";

// RTK Query APIs
import { productApi } from "../api/productApi";
import { errorApi } from "../api/errorApi";
import { basketApi } from "../api/basketApi";
import { userApi } from "../../features/user/userApi";
import { orderApi } from "../api/orderApi";
import { paymentApi } from "../api/paymentApi";
import { addressApi } from "../api/addressApi";
import { filterTagValueApi } from "../api/filterTagValueApi";
import { filterTagApi } from "../api/filterTagApi";
import { photoApi } from "../api/photoApi";
import { categoryApi } from "../api/categoryApi";
import { bannerApi } from "../api/bannerApi";

export const resetState = createAction("app/reset-state");

//Root reducer with ALL slices
export const rootReducer = combineReducers({
  [productApi.reducerPath]: productApi.reducer,
  [errorApi.reducerPath]: errorApi.reducer,
  [basketApi.reducerPath]: basketApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [addressApi.reducerPath]: addressApi.reducer,
  [filterTagValueApi.reducerPath]: filterTagValueApi.reducer,
  [filterTagApi.reducerPath]: filterTagApi.reducer,
  [photoApi.reducerPath]: photoApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [bannerApi.reducerPath]: bannerApi.reducer,

  counter: counterReducer,
  ui: uiReducer,
  auth: authReducer,
  user: userReducer,
  basket: basketReducer,
  filter: filterReducer,
  order: orderReducer
});


//Persist config: chỉ persist nhung store trong whitelist
const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["basket", "filter", "order"],
};

//Create persistedReducer (wrapped version of rootReducer)
const persistedReducer = persistReducer(persistConfig, rootReducer);

//Store setup
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
      paymentApi.middleware,
      addressApi.middleware,
      filterTagValueApi.middleware,
      filterTagApi.middleware,
      photoApi.middleware,
      categoryApi.middleware,
      bannerApi.middleware,
    ),
});

//Persistor instance
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
