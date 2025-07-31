import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/Routes.tsx';
import { Provider } from 'react-redux';
import { persistor, store } from './app/store/store.ts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import { Box, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { NotificationProvider } from './app/context/NotificationProvider.tsx';
import './style/global.css';

// import { NotificationContainer } from './features/notification/NotificationContainer.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Provider store={store}>
        <PersistGate 
          loading={ 
              <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100vh" // Chiều cao toàn trang
              >
                  <CircularProgress />
              </Box>
          } 
            persistor={persistor}>
        </PersistGate>
        <ToastContainer position='bottom-right' hideProgressBar theme='colored'/>
        <NotificationProvider>
          <RouterProvider router={router} />
        </NotificationProvider>
      </Provider>  
    </LocalizationProvider>
  </StrictMode>,
)
