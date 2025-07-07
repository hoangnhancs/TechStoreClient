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

// Local reducers
import counterReducer from "../../features/counter/counterSlice";
import uiReducer from "../../layouts/uiSlice";
import basketReducer from "../../features/basket/basketSlice";
import filterReducer from "../../features/filter/filterSlice";
import authReducer from "../slice/authSlice";
import userReducer from "../../features/user/userSlice";

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

  counter: counterReducer,
  ui: uiReducer,
  auth: authReducer,
  user: userReducer,
  basket: basketReducer,
  filter: filterReducer,
});

//Persist config: chỉ persist basket và filter
const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["basket", "filter"],
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
      filterTagApi.middleware
    ),
});

//Persistor instance
export const persistor = persistStore(store);
