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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
      <RouterProvider router={router} />
    </Provider>  
  </StrictMode>,
)
