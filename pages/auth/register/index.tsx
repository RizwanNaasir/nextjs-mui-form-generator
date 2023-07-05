import {styled} from '@mui/material/styles';
import {Container, Divider, IconButton, InputAdornment, Link, Stack, TextField, Typography} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import React, {useState} from "react";
import {useForm} from '@mantine/form';
import {login, register} from "@/utils/AuthProvider";
import {useSnackbar} from "notistack";

const StyledRoot = styled('div')(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const StyledContent = styled('div')(({theme}) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

export default function RegisterPage() {
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });
    const {enqueueSnackbar} = useSnackbar();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (values) => {
        setLoading(true);
        await register({
            name: values.name,
            email: values.email,
            password: values.password
        }).then(async () => {
            enqueueSnackbar('Register successful', {variant: 'success'});
            await login({
                user: values.email,
                password: values.password
            }).then(() => {
                enqueueSnackbar('Login successful', {variant: 'success'});
                setLoading(false)
                window.location.href = '/dashboard';
            }).catch((err) => {
                enqueueSnackbar(err.message, {variant: 'error'});
                setLoading(false);
            });
        }).catch((err) => {
            enqueueSnackbar(err.message, {variant: 'error'});
            setLoading(false);
        });
    };
    return (
        <>
            <StyledRoot>
                <Container maxWidth="sm">
                    <StyledContent>
                        <form onSubmit={form.onSubmit(
                            (values) => handleSubmit(values)
                        )}>
                            <Typography variant="h4" gutterBottom>
                                Sign Up
                            </Typography>

                            <Typography variant="body2" sx={{mb: 5}}>
                                Already have an account? {''}
                                <Link variant="subtitle2" href="/auth/login">Login</Link>
                            </Typography>

                            <Divider sx={{my: 3}}>
                                <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                    OR
                                </Typography>
                            </Divider>

                            <Stack spacing={3}>
                                <TextField
                                    name="name" label="Name"
                                    {...form.getInputProps('name')}
                                />

                                <TextField
                                    name="email" label="Email address"
                                    {...form.getInputProps('email')}
                                />

                                <TextField
                                    name="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...form.getInputProps('password')}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Stack>

                            <LoadingButton sx={{my: 3}}
                                           fullWidth
                                           size="large"
                                           type="submit"
                                           variant="contained"
                                           loading={loading}
                            >
                                Register
                            </LoadingButton>
                        </form>
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}