import { createTheme, Theme } from "@mui/material";

export const getAppTheme = (mode: 'light' | 'dark'): Theme => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#38bdf8' : '#0284c7', // Sky Blue/Neon Cyan
        light: mode === 'dark' ? '#7dd3fc' : '#38bdf8',
        dark: mode === 'dark' ? '#0284c7' : '#0369a1',
        contrastText: '#ffffff',
      },
      secondary: {
        main: mode === 'dark' ? '#a78bfa' : '#6366f1', // Indigo/Violet
        light: mode === 'dark' ? '#c084fc' : '#818cf8',
        dark: mode === 'dark' ? '#6366f1' : '#4f46e5',
        contrastText: '#ffffff',
      },
      background: {
        default: mode === 'dark' ? '#090d16' : '#f8fafc', // Deep dark slate vs Slate 50
        paper: mode === 'dark' ? '#111827' : '#ffffff',   // Dark Gray/White
      },
      text: {
        primary: mode === 'dark' ? '#f3f4f6' : '#1e293b',   // Off-white vs Slate 800
        secondary: mode === 'dark' ? '#9ca3af' : '#64748b', // Cool gray vs Slate 500
      },
      divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      action: {
        hover: mode === 'dark' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(2, 132, 199, 0.04)',
        selected: mode === 'dark' ? 'rgba(56, 189, 248, 0.16)' : 'rgba(2, 132, 199, 0.08)',
      }
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: [
        'Inter',
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'sans-serif',
      ].join(','),
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 500 },
      body1: { lineHeight: 1.6 },
      body2: { lineHeight: 1.5 },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 16px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          containedPrimary: {
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)'
              : 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)',
            boxShadow: mode === 'dark'
              ? '0 4px 14px rgba(56, 189, 248, 0.2)'
              : '0 4px 14px rgba(2, 132, 199, 0.15)',
          },
          containedSecondary: {
            background: mode === 'dark'
              ? 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)'
              : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
            boxShadow: mode === 'dark'
              ? '0 4px 14px rgba(167, 139, 250, 0.2)'
              : '0 4px 14px rgba(99, 102, 241, 0.15)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: mode === 'dark' 
              ? '0 10px 30px -15px rgba(0,0,0,0.7)' 
              : '0 10px 30px -15px rgba(148, 163, 184, 0.15)',
            overflow: 'hidden',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: '16px',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: '20px',
            padding: '8px',
          },
        },
      },
      MuiAppBar: {
  styleOverrides: {
    root: {
      borderRadius: 0,
      boxShadow: mode === 'dark'
        ? '0 1px 0 rgba(255, 255, 255, 0.12)'
        : '0 2px 4px rgba(0, 0, 0, 0.15)',
    },
  },
},
    },
  });
};
