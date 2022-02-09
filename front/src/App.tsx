import './App.scss';

import React from 'react';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import ShoppingList from './components/ShoppingList';
import { AppBar, Box, createTheme, ThemeProvider, Toolbar, Typography, useScrollTrigger } from '@mui/material';


export default function App() {
  return (
    <div>
      <Routes> {/* Could be consolidated */}
        <Route path="*" element={<Layout />} />
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <ThemeProvider theme={theme}>
      <ElevationScroll>
        <AppBar sx={{backgroundColor:(theme)=>theme.palette.primary.light}}>
          <Toolbar>
            <Link to="/"><Typography color='white' fontWeight={600}>SHOPPING LIST</Typography></Link>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      
      <Toolbar />

      <Box sx={{ my: 2, width:'1025px', maxWidth:'90%', mx: 'auto' }}>
        <ShoppingList />
      </Box>

      <Outlet />
    </ThemeProvider>
  );
}


function ElevationScroll({ children }: { children: React.ReactElement}) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}


const dosis = {fontFamily: 'Dosis, sans-serif',};
const nunito = {fontFamily: 'Nunito, sans-serif',}

const theme = createTheme({
  palette: {
    primary: {
      light: '#4D81B7',
      main: '#1871E8',
    }
  },
  typography: {
    h1: {
      ...dosis,
      fontWeight: 600,
      fontSize: '18px',
      lineHeight: '23px',
      letterSpacing: '0.25px',
      color: '#5C6269',
    },
    h2: {
      ...nunito,
      fontWeight: 'normal',
      fontSize: '18px',
      lineHeight: '24px',
      letterSpacing: '0px',
      color: '#2A323C',
    },
    h3: {
      ...nunito,
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '0px',
      color: '#000',
    },
    h4: nunito,
    h5: nunito,
    h6: nunito,
    subtitle1: {
      ...nunito,
      fontWeight: 'normal',
      fontSize: '16px',
      lineHeight: '22px',
      letterSpacing: '0px',
      color: '#5C6269',
    },
    subtitle2: {
      ...nunito,
      weight: 600,
      fontSize: '14px',
      lineHeight: '20px',
      color: '#7D7A7A'
    },
    body1: nunito,
    body2: {
      ...nunito,
      weight: 400,
      fontSize: '14px',
      lineHeight: '20px',
      color: 'rgba(92, 98, 105, 1)',
    },
    caption: {
      ...nunito,
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '16px',
      color: '#5C6269',
    },
    button: nunito,
    overline: nunito,
  },
  components: {
    MuiButtonGroup: {
      defaultProps: { disableElevation: true, }
    },
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600, padding: '8px 15px' } },
      defaultProps: { disableElevation: true }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        sx: {
          boxShadow: 'none',
        },
        
      },
    },
    MuiTextField: {
      defaultProps: {sx: { width: '100%' } },
    }
  },
});

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}
