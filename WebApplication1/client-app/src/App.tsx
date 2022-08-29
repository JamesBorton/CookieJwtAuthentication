import { observer } from 'mobx-react-lite';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import AuthenticationTest from './features/authenticate/AuthenticationTest';
import 'react-toastify/dist/ReactToastify.css';
import AuthenticationTestMobX from './features/authenticate/AuthenticationTestMobX';
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { theme } from '@chakra-ui/pro-theme'
import '@fontsource/inter/variable.css'
import NavBar from './layout/nav/NavBar';
import { Route, Routes } from 'react-router-dom';
import Login from './layout/auth/Login';
import RequireAuth from './features/authenticate/RequireAuth';
import Profile from './layout/auth/Profile';


const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
}

const myTheme = extendTheme(
  {
    config,
    colors: { ...theme.colors, brand: theme.colors.blue },
  },
  theme,
)

export default observer(function App() {
  return (
    <ChakraProvider theme={myTheme}>
      <NavBar />
      <Routes>
          <Route path="/" element={<AuthenticationTestMobX />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
      </Routes>
       <ToastContainer position='bottom-center' />
    </ChakraProvider>
  );
});
