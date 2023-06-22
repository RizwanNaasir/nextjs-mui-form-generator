import {styled} from '@mui/material/styles';
import {
    Checkbox,
    Container,
    Divider,
    IconButton,
    InputAdornment,
    Link,
    Snackbar,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import React, {useState} from "react";
import {useForm} from '@mantine/form';
import {login} from "@/utils/PocketBase";

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
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const handleSubmit = async (values) => {
        await login({
            user: values.email,
            password: values.password
        }).then((res) => {
            setOpen(true);
            setSnackMessage('Login success!');
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.record));
            document.cookie = `token=${res.token}; path=/;`;
            window.location.href = '/dashboard';
        }).catch((err) => {
            setOpen(true);
            setSnackMessage(err.message);
        });
    };
    return (
        <>
            <StyledRoot>
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    message={snackMessage}
                    onClose={() => setOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                />
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
                                <Link variant="subtitle2">Get started</Link>
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

                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{my: 2}}>
                                <Checkbox name="remember"/>
                                <Link variant="subtitle2" underline="hover">
                                    Forgot password?
                                </Link>
                            </Stack>

                            <LoadingButton fullWidth size="large" type="submit" variant="contained">
                                Login
                            </LoadingButton>
                        </form>
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}