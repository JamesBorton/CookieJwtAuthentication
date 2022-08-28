import { observer } from 'mobx-react-lite';
import React from 'react';
import {
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
    useDisclosure,
    useMergeRefs,
} from '@chakra-ui/react'
import { Logo } from '../nav/Logo';
import { PasswordField } from '../PasswordField';
import { Field, Form, Formik, FormikHelpers, useFormik } from 'formik';
import * as yup from 'yup';
import FormErrorMessageCustom from '../forms/FormErrorMessageCustom';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const validationSchema = yup.object({
    username: yup
        .string()
        .required('Username is required'),
    password: yup
        .string()
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
});
export default observer(function Login() {
    const { isOpen, onToggle } = useDisclosure()
const inputRef = React.useRef<HTMLInputElement>(null)

const onClickReveal = () => {
    onToggle()
    if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true })
    }
}

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    return (
        <>
            <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
                <Stack spacing="8">
                    <Stack spacing="6">
                        <Logo />
                        <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
                            <Heading size={useBreakpointValue({ base: 'xs', md: 'sm' })}>
                                Log in to your account
                            </Heading>
                            <HStack spacing="1" justify="center">
                                <Text color="muted">Don't have an account?</Text>
                                <Button variant="link" colorScheme="blue">
                                    Sign up
                                </Button>
                            </HStack>
                        </Stack>
                    </Stack>
                    <Box
                        py={{ base: '0', sm: '8' }}
                        px={{ base: '4', sm: '10' }}
                        bg={useBreakpointValue({ base: 'transparent', sm: 'bg-surface' })}
                        boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
                        borderRadius={{ base: 'none', sm: 'xl' }}
                    >
                        <form onSubmit={formik.handleSubmit}>
                            <Stack spacing="6">
                                <Stack spacing="5">
                                    <FormControl>
                                        <FormLabel>Username</FormLabel>
                                        <Input id="username"
                                            name="username"
                                            value={formik.values.username}
                                            onChange={formik.handleChange}
                                            isInvalid={formik.touched.username && Boolean(formik.errors.username)}
                                            errorBorderColor='crimson'
                                        />
                                        <FormErrorMessageCustom message={formik.errors.username} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="password">Password</FormLabel>
                                        <InputGroup>
                                            <InputRightElement>
                                                <IconButton
                                                    variant="link"
                                                    aria-label={isOpen ? 'Mask password' : 'Reveal password'}
                                                    icon={isOpen ? <HiEyeOff /> : <HiEye />}
                                                    onClick={onClickReveal}
                                                />
                                            </InputRightElement>
                                            <Input
                                                id="password"
                                                name="password"
                                                type={isOpen ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                isInvalid={formik.touched.password && Boolean(formik.errors.password)}
                                            />
                                        </InputGroup>
                                        <FormErrorMessageCustom message={formik.errors.password} />
                                    </FormControl>
                                </Stack>
                                <HStack justify="space-between">
                                    <Checkbox defaultChecked>Remember me</Checkbox>
                                    <Button variant="link" colorScheme="blue" size="sm">
                                        Forgot password?
                                    </Button>
                                </HStack>
                                <Stack spacing="6">
                                    <Button type='submit' variant="primary">Sign in</Button>
                                </Stack>
                            </Stack>
                        </form>
                    </Box>
                </Stack>
            </Container>
        </>

    )
});