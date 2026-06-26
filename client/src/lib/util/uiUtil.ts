import { LoadingPriority, startLoading, stopLoading } from "../../layouts/uiSlice";

let storeInstance: any = null;

export const uiUtil = {
  registerStore: (store: any) => {
    storeInstance = store;
  },
  startLoading: (priority: LoadingPriority = LoadingPriority.HIGH) => {
    if (storeInstance) {
      storeInstance.dispatch(startLoading(priority));
    }
  },
  stopLoading: (priority: LoadingPriority = LoadingPriority.HIGH) => {
    if (storeInstance) {
      storeInstance.dispatch(stopLoading(priority));
    }
  }
};

