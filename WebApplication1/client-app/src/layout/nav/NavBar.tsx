import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Container,
    Flex,
    HStack,
    IconButton,
    useBreakpointValue,
    useColorModeValue,
  } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
  import * as React from 'react'
  import { FiHelpCircle, FiMenu, FiSearch, FiSettings } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useStore } from '../../stores/store'
import { GMLogo } from './GMLogo'
  import { Logo } from './Logo'
  
  export default observer(function NavBar () {
    const {userStore} = useStore();
    const isDesktop = useBreakpointValue({ base: false, lg: true })
    return (
      <Box as="section" pb={{ base: '12', md: '24' }}>
        <Box as="nav" bg="bg-surface" boxShadow={useColorModeValue('sm', 'sm-dark')}>
          <Container py={{ base: '3', lg: '4' }}>
            <Flex justify="space-between">
              <HStack spacing="4">
                <GMLogo />
                {isDesktop && (
                  <ButtonGroup variant="ghost" spacing="1">
                    <Link to='/'><Button>Home</Button></Link>
                    <Link to='/profile'><Button>Profile</Button></Link>
                    <Link to='/login'><Button>Login</Button></Link>
                  </ButtonGroup>
                )}
              </HStack>
              {isDesktop ? (
                <HStack spacing="4">
                  <ButtonGroup variant="ghost" spacing="1">
                    <IconButton icon={<FiSearch fontSize="1.25rem" />} aria-label="Search" />
                    <IconButton icon={<FiSettings fontSize="1.25rem" />} aria-label="Settings" />
                    <IconButton icon={<FiHelpCircle fontSize="1.25rem" />} aria-label="Help Center" />
                  </ButtonGroup>
                  {userStore.userDetails == null ? (
                    <Button onClick={() => userStore.login({username:'admin', password: 'P@ssw0rd'})}>Login</Button>
                  ) : (
                    <>
                    <Avatar boxSize="10" name={userStore.userDetails.displayName} src={userStore.userDetails.image} />
                    <Button onClick={userStore.logout}>Logout</Button>
                    </>
                  )}
                  
                </HStack>
              ) : (
                <IconButton
                  variant="ghost"
                  icon={<FiMenu fontSize="1.25rem" />}
                  aria-label="Open Menu"
                />
              )}
            </Flex>
          </Container>
        </Box>
      </Box>
    )
  })