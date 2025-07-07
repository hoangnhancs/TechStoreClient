import { StoreMallDirectory, DarkMode, LightMode, ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, CircularProgress, Container, Divider, IconButton, List, Toolbar, Typography } from "@mui/material";
import MenuItemLink from "../components/MenuItemLink";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, Close } from "@mui/icons-material";
import { useMediaQuery, useTheme, Drawer } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { toggleDarkMode } from "./uiSlice";
import UserMenu from "../features/user/UserMenu";
import LoginPromptDialog from "../components/LoginPromptDialog";
import { useFetchBasketQuery } from "../app/api/basketApi";
import { useGetCurrentUserQuery } from "../features/user/userApi";





const midLinks = [
    {title: 'products', path: '/products'},
    {title: 'about', path: '/about'},
    {title: 'contact', path: '/contact'},
    {title: 'counter', path: '/counter'},
    {title: 'error', path: '/error'},
]

const rightLinks = [
    {title: 'login', path: '/login'},
    {title: 'register', path: '/register'},
]
export default function NavBar() {

  const {isLoading, isDarkMode} = useAppSelector(state => state.ui)
  // const [userInfoJson, setUserInfoJson] = useState<BasicUser | null>(null)
  // const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const {data: currentUser} = useGetCurrentUserQuery()
  const {data: basket} = useFetchBasketQuery(undefined, {
    skip: !currentUser})
  const dispatch = useAppDispatch()
  const theme = useTheme();
  // const userInfoCookie = document.cookie.split(';').find(c => c.trim().startsWith('user='))?.replace('user=', '');
  
  
  // const {data: currentUser} = useGetCurrentUserQuery();
  // const currentUser = useAppSelector(state => state.user.currentUser);
  
  // useEffect(() => {
  //   if (userInfoCookie) {
  //     const decode = decodeURIComponent(userInfoCookie)
  //     const userInfo = JSON.parse(decode)
  //     console.log(userInfo)
  //     console.log(userInfoCookie)
  //     setUserInfoJson(userInfo);
  //   } else {
  //     setUserInfoJson(null);
  //   }
  // }, [userInfoCookie])

  

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLoginPrompt, setOpenLoginPrompt] = useState(false);
  const navigate = useNavigate()

  const handleClickShoppingCart = () => {
    if (!currentUser) {
      setOpenLoginPrompt(true);
    }
    else {
      navigate('/basket')
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };  

  const mobileMenu = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <StoreMallDirectory sx={{ fontSize: '2rem' }} />
        <Typography variant="h6" sx={{ ml: 1 }}>RE-STORE</Typography>
        <IconButton onClick={() => dispatch(toggleDarkMode())}>
          {!isDarkMode ? <LightMode sx={{color: 'yellow'}} /> : <DarkMode />}
        </IconButton>
      </Box>
      <List>
        {midLinks.map(({title, path}) => (
          <MenuItemLink 
            key={path} 
            to={path} 
          >
            {title.toUpperCase()}
          </MenuItemLink>
        ))}
      </List>
      <Divider />
      {currentUser ? (<UserMenu currentUser={currentUser} />) : (
        <List>
          {rightLinks.map(({title, path}) => (
            <MenuItemLink 
              key={path} 
              to={path}
            >
              {title.toUpperCase()}
            </MenuItemLink>
          ))}
        </List>
      )} 
    </Box>
  );

  return (
    <AppBar position="fixed" >
      <Container maxWidth='xl'>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', height: '80px !important' }}>
          {/* Logo và Brand */}
          <Box display="flex" alignItems="center" component={NavLink}
              to="/" sx={{textDecoration: 'none', color: 'inherit'}}>
            <StoreMallDirectory sx={{ fontSize: '2.5rem' }} />
            <Typography 
              variant="h6"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 'bold',
                textDecoration: 'none',
                color: 'inherit',
                ml: 1
              }}
            >
              RE-STORE
            </Typography>
            <IconButton sx={{ml: 2}} onClick={() => dispatch(toggleDarkMode())}>
              {!isDarkMode ? <LightMode sx={{color: 'yellow'}} /> : <DarkMode />}
            </IconButton>
            <Box>
              {isLoading && (
                <CircularProgress />
              )}
            </Box>
          </Box>

          {/* Desktop Menu */}
          {!isMobile && (
            <>
              <List sx={{ display: 'flex', gap: 1 }}>
                {midLinks.map(({title, path}) => (
                  <MenuItemLink key={path} to={path}>
                    {title.toUpperCase()}
                  </MenuItemLink>
                ))}
              </List>

              <Box display="flex" alignItems="center" sx={{ minWidth: 300, justifyContent: 'flex-end' }}>
                <IconButton onClick={handleClickShoppingCart} color="inherit" sx={{ mr: 3 }}>
                  <Badge badgeContent={currentUser ? basket?.items.length || 0 : 0} color="secondary">
                    <ShoppingCart sx={{borderRadius: '25%'}} />
                  </Badge>
                </IconButton>
                <Box sx={{ width: 220, display: 'flex', justifyContent: 'flex-start' }}>
                  {currentUser ? (
                    <UserMenu currentUser={currentUser} />
                  ) : (
                    <List sx={{ display: 'flex', gap: 1 }}>
                      {rightLinks.map(({title, path}) => (
                        <MenuItemLink key={path} to={path}>
                          {title.toUpperCase()}
                        </MenuItemLink>
                      ))}
                    </List>
                  )}
                </Box>  
              </Box>
              <LoginPromptDialog open={openLoginPrompt} onClose={() => setOpenLoginPrompt(false)} />
            </>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Box display="flex" alignItems="center">
              <IconButton onClick={() => dispatch(toggleDarkMode())} sx={{ mr: 1 }}>
                {!isDarkMode ? <LightMode sx={{color: 'yellow'}} /> : <DarkMode />}
              </IconButton>
              <IconButton onClick={handleClickShoppingCart} color="inherit" sx={{ mr: 1 }}>
                <Badge badgeContent={currentUser ? basket?.items.length || 0 : 0} color="secondary">
                  <ShoppingCart />
                </Badge>
              </IconButton>
              <IconButton
                color="inherit"
                onClick={handleDrawerToggle}
              >
                {mobileOpen ? <Close /> : <Menu />}
              </IconButton>
            </Box>
          )}
        </Toolbar>      
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better mobile performance
        }}
      >
        {mobileMenu}
      </Drawer>
    </AppBar>
  );
}