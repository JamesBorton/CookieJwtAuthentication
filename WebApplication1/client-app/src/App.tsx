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


const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
}

const myTheme = extendTheme(
  {
    config,
    colors: { ...theme.colors, brand: theme.colors.red },
  },
  theme,
)

export default observer(function App() {
  return (
    <ChakraProvider theme={myTheme}>
      <NavBar />
       <AuthenticationTestMobX />
       <ToastContainer />
    </ChakraProvider>
  );
});
