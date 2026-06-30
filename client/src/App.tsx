import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material"
import NavBar from "./layouts/NavBar"
import { Outlet, useLocation } from "react-router-dom"
import { useAppSelector } from "./hooks"
import LoadingOverlay from "./components/LoadingOverlay"
import { SnackbarProvider } from 'notistack';
import HomePage from "./pages/HomePage"
import { NotificationContainer } from "./features/notification/NotificationContainer"
import "./style/global.css"
import { getAppTheme } from "./style/theme"
import { useGetCurrentUserQuery } from "./features/user/userApi"


function App() {
  useGetCurrentUserQuery()
  const hideNavRoutes = ['/', '/login', '/register', '/forgot-password', '/confirm-email', '/reset-password'];
  const isDarkMode = useAppSelector(state => state.ui.isDarkMode) 
  const palletteType = isDarkMode ? 'dark' : 'light'
  const location = useLocation()
  const shouldHideNav = hideNavRoutes.includes(location.pathname);


  // useEffect(() => {
  //   const raw = document.cookie.split(";").find(c => c.trim().startsWith("user="));
  //   if (raw) {
  //     try {
  //       const decoded = decodeURIComponent(raw.replace("user=", ""));
  //       const userObj = JSON.parse(decoded);
  //       dispatch(setCurrentUser(userObj));
  //       console.log(userObj);
  //     } catch {
  //       // invalid cookie format
  //     }
  //   }
  //   else {
  //     dispatch(clearCurrentUser());
  //   }
  // }, [dispatch]);
  const theme = getAppTheme(palletteType)


  return (
    <>
      <SnackbarProvider maxSnack={5}>
        <LoadingOverlay />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {shouldHideNav  ? null : <NavBar />}
          <Box
            sx={{
              background: isDarkMode 
                ? 'linear-gradient(to bottom, #090d16 0%, #111827 100%)' 
                : 'linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%)',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {location.pathname === '/' ? 
              <HomePage /> 
                : 
              <Container maxWidth="xl" sx={{ 
                mt: { xs: 12, md: 14 },
                mb: 4
              }}>
                <NotificationContainer />
                <Outlet /> 
              </Container> 
            }
          </Box>
        </ThemeProvider> 
      </SnackbarProvider>
    </>    
    // Outlet sẽ hiển thị những gì nằm trong children của Route hiện tại. Để nó hoạt động
  )
}

export default App
