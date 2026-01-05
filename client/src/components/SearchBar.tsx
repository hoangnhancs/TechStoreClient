import { Search, Close, TrendingUp, History } from "@mui/icons-material";
import { 
  Box, 
  IconButton, 
  InputBase, 
  Paper, 
  useTheme,
  alpha,
  Popper,
  ClickAwayListener,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  isMobile?: boolean;
}

// Popular search suggestions
const popularSearches = [
  "iPhone 15",
  "MacBook Pro",
  "Samsung Galaxy",
  "Sony Camera",
  "Dell Laptop"
];

export default function SearchBar({ isMobile = false }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      performSearch(searchValue.trim());
    }
  };

  const performSearch = (query: string) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
    
    // Save to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    setSearchValue("");
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    searchInputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleClickAway = () => {
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    performSearch(suggestion);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Desktop version - modern search with suggestions
  if (!isMobile) {
    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box sx={{ position: 'relative', flex: 1, maxWidth: 600, mx: 3 }}>
          <Paper
            ref={searchBoxRef}
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: 48,
              px: 2,
              backgroundColor: alpha(theme.palette.common.white, theme.palette.mode === 'dark' ? 0.1 : 0.95),
              border: `2px solid ${alpha(theme.palette.primary.main, showSuggestions ? 0.5 : 0)}`,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              boxShadow: showSuggestions ? theme.shadows[8] : theme.shadows[1],
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, theme.palette.mode === 'dark' ? 0.15 : 1),
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <Search sx={{ 
              color: theme.palette.mode === 'dark' ? 'inherit' : 'text.secondary', 
              mr: 1.5,
              fontSize: 24
            }} />
            <InputBase
              inputRef={searchInputRef}
              placeholder="Tìm kiếm sản phẩm, thương hiệu..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={handleInputFocus}
              sx={{ 
                flex: 1,
                fontSize: '0.95rem',
                color: theme.palette.mode === 'dark' ? 'inherit' : 'text.primary',
                '& input::placeholder': {
                  color: theme.palette.mode === 'dark' ? 'inherit' : 'text.secondary',
                  opacity: 0.7
                }
              }}
            />
            {searchValue && (
              <IconButton
                size="small"
                onClick={handleClearSearch}
                sx={{ 
                  color: theme.palette.mode === 'dark' ? 'inherit' : 'text.secondary',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                  }
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            )}
          </Paper>

          <Popper
            open={showSuggestions}
            anchorEl={searchBoxRef.current}
            placement="bottom-start"
            style={{ 
              width: searchBoxRef.current?.offsetWidth || 'auto',
              zIndex: 1300
            }}
          >
            <Paper
              sx={{
                mt: 1,
                maxHeight: 400,
                overflow: 'auto',
                boxShadow: theme.shadows[12],
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}
            >
              {recentSearches.length > 0 && (
                <>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    px: 2, 
                    py: 1.5 
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                      Tìm kiếm gần đây
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="primary"
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={clearRecentSearches}
                    >
                      Xóa tất cả
                    </Typography>
                  </Box>
                  <List dense>
                    {recentSearches.map((search, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemButton 
                          onClick={() => handleSuggestionClick(search)}
                          sx={{
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.08)
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <History fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={search} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                </>
              )}
              
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600} mb={1}>
                  Tìm kiếm phổ biến
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {popularSearches.map((search, index) => (
                    <Chip
                      key={index}
                      icon={<TrendingUp fontSize="small" />}
                      label={search}
                      onClick={() => handleSuggestionClick(search)}
                      size="small"
                      sx={{
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.2)
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          </Popper>
        </Box>
      </ClickAwayListener>
    );
  }

  // Mobile version - full width search
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Paper
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: 48,
          px: 2,
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          '&:focus-within': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          }
        }}
        elevation={0}
      >
        <Search sx={{ color: 'text.secondary', mr: 1.5 }} />
        <InputBase
          placeholder="Tìm kiếm sản phẩm..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{ 
            flex: 1,
            fontSize: '0.95rem',
            '& input::placeholder': {
              color: 'text.secondary',
              opacity: 0.7
            }
          }}
        />
        {searchValue && (
          <IconButton
            size="small"
            onClick={handleClearSearch}
            sx={{ p: 0.5 }}
          >
            <Close fontSize="small" />
          </IconButton>
        )}
      </Paper>
    </Box>
  );
}
