
import { Box, Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import NavBar from "./layouts/NavBar"
import { Outlet, useLocation } from "react-router-dom"
import { useAppSelector } from "./hooks"
import LoadingOverlay from "./components/LoadingOverlay"



function App() {
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
  const theme = createTheme({
    palette: {
      mode: palletteType,
      background: {
        default: palletteType === 'dark' 
          ? '#121212' 
          : '#f5f5f5',
        paper: palletteType === 'dark' 
          ? '#1e1e1e' 
          : '#ffffff'
      },
      primary: {
        main: palletteType === 'dark' 
          ? '#90caf9' 
          : '#1976d2',
        light: palletteType === 'dark' 
          ? '#e3f2fd' 
          : '#42a5f5',
        dark: palletteType === 'dark' 
          ? '#42a5f5' 
          : '#1565c0'
      },
      secondary: {
        main: palletteType === 'dark' 
          ? '#ce93d8' 
          : '#9c27b0',
        light: palletteType === 'dark' 
          ? '#f3e5f5' 
          : '#ba68c8',
        dark: palletteType === 'dark' 
          ? '#ab47bc' 
          : '#7b1fa2'
      },
      text: {
        primary: palletteType === 'dark' 
          ? '#ffffff' 
          : '#000000',
        secondary: palletteType === 'dark' 
          ? '#b0b0b0' 
          : '#666666'
      }
    }
  })


  return (
    <>
      <LoadingOverlay />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {shouldHideNav  ? null : <NavBar />}
        <Box
          sx={{
            background: isDarkMode 
              ? 'linear-gradient(to bottom, #1a237e 0%, #121212 100%)' 
              : 'linear-gradient(to bottom, #bbdefb 0%, #f5f5f5 100%)',
            minHeight: '100vh',
            
            display: 'flex',
            flexDirection: 'column',
            
            
          }}
        >
          <Container maxWidth="xl" sx={{ 
            mt: 12  // marginTop responsive
          }}>
            <Outlet /> 
          </Container> 
        </Box>
      </ThemeProvider> 
    </>    
    // Outlet sẽ hiển thị những gì nằm trong children của Route hiện tại. Để nó hoạt động
  )
}

export default App
