import {styled} from '@mui/material/styles';
import {Container, Divider, IconButton, InputAdornment, Link, Stack, TextField, Typography} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import React, {useState} from "react";
import {useForm} from '@mantine/form';
import {login} from "@/utils/PocketBase";
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

export default function LoginPage() {
    const form = useForm({
        initialValues: {
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
        await login({
            user: values.email,
            password: values.password
        }).then((res) => {
            enqueueSnackbar('Login successful', {variant: 'success'});
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.record));
            document.cookie = `token=${res.token}; path=/;`;
            setLoading(false)
            window.location.href = '/dashboard';
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
                                Sign in to Minimal
                            </Typography>

                            <Typography variant="body2" sx={{mb: 5}}>
                                Don’t have an account? {''}
                                <Link variant="subtitle2" href="/auth/register">Regsiter</Link>
                            </Typography>

                            <Divider sx={{my: 3}}>
                                <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                    OR
                                </Typography>
                            </Divider>

                            <Stack spacing={3}>
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
                            <LoadingButton sx={{my: 3}} fullWidth size="large" type="submit" variant="contained"
                                           loading={loading}>
                                Login
                            </LoadingButton>
                        </form>
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}