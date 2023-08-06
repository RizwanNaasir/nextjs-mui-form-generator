import SidebarLayout from '@/layouts/SidebarLayout';
import PropTypes from 'prop-types';
import {ReactChild, ReactFragment, ReactPortal, SyntheticEvent, useState} from 'react';
import {Autocomplete, Box, Chip, IconButton, Stack, Tab, TextField, Typography} from '@mui/material';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {TabContext, TabList, TabPanel} from "@mui/lab";
import Mail from '@mui/icons-material/Mail';
import Link from '@mui/icons-material/Link';
import Code from '@mui/icons-material/Code';
import {useSnackbar} from "notistack";
import {FormBlueprint} from "@/models/form";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import LoadingButton from "@mui/lab/LoadingButton";
import {useForm} from "@mantine/form";


function SimpleDialog(props: { formBlueprint: FormBlueprint; open: any; onClose: any }) {
    const {open, formBlueprint, onClose} = props;
    const [value, setValue] = useState(1);
    const {enqueueSnackbar} = useSnackbar();
    const [emails, setEmails] = useState([]);
    const [email, setEmail] = useState('');

    const [loading, setLoading] = useState(false);
    const mailForm = useForm({
        initialValues: {
            subject: "",
            body: ""
        }
    })

    const handleClose = () => {
    };

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const sendMail = async () => {
        setLoading(true);
        const data = {
            ...mailForm.values,
            emails,
        };
        const response = await fetch("/api/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...data,
                formLink: `${window.location.origin}/forms/${formBlueprint.id}`
            })
        });
        setLoading(false);
        const result = await response.json();
        if (response.ok) {
            enqueueSnackbar(`Mail sent successfully. Sent: ${result?.sent}`, {
                variant: "success"
            });
        } else {
            enqueueSnackbar(`Mail could not be sent. Failed: ${result?.failed}`, {
                variant: "error"
            });
        }
    }

    return (
        <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth={true}>
            <DialogTitle sx={{m: 0, p: 2}}>
                <Typography variant="h3" gutterBottom component="div">
                    Share Form
                </Typography>
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseTwoToneIcon/>
                    </IconButton>
                ) : null}
            </DialogTitle>
            <TabContext value={value.toString()}>
                <Box sx={{borderBottom: 1, borderColor: 'divider', p: 2}}>
                    <Stack direction="row" spacing={2}>
                        <div>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label={<Mail/>} value="1"/>
                                <Tab label={<Link/>} value="2"/>
                                <Tab label={<Code/>} value="3"/>
                            </TabList>
                        </div>
                    </Stack>
                </Box>

                <TabPanel value="1">
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': {m: 1},
                        }}
                    >
                        <Typography variant="h6" gutterBottom component="div">
                            Email
                        </Typography>
                        <Autocomplete
                            multiple
                            freeSolo
                            fullWidth
                            options={[]}
                            value={emails}
                            inputValue={email}
                            onInputChange={(_event, newValue) => {
                                setEmail(newValue);
                            }}
                            onChange={(_event, newValue) => {
                                setEmails(newValue);
                            }}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        key={option}
                                        variant="outlined"
                                        label={option}
                                        {...getTagProps({index})}
                                    />
                                ))
                            }
                            renderInput={(params) => {
                                const onBlur = () => {
                                    if (email.length > 0) {
                                        setEmails([...emails, email]);
                                        setEmail('');
                                    }
                                }

                                return (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Enter email addresses"
                                        placeholder="Emails"
                                        onBlur={onBlur}
                                    />
                                )
                            }}
                        />

                        <TextField
                            id="subject"
                            label="Subject"
                            variant="outlined"
                            fullWidth
                            {...mailForm.getInputProps('subject')}
                        />
                        <TextField
                            id="message"
                            label="Message"
                            variant="outlined"
                            multiline
                            rows={4}
                            fullWidth
                            {...mailForm.getInputProps('body')}
                        />
                    </Box>
                    <LoadingButton
                        variant="contained"
                        loading={loading}
                        sx={{mt: 2, float: "right"}}
                        onClick={sendMail}
                    >
                        Send
                    </LoadingButton>
                </TabPanel>
                <TabPanel value="2">
                    <Typography variant="h6" gutterBottom component="div">
                        Copy link
                    </Typography>
                    <Button
                        onClick={async () => {
                            await navigator.clipboard.writeText(
                                `${window.location.origin}/forms/${formBlueprint.id}`
                            );
                            enqueueSnackbar("Copied to clipboard", {variant: "success"});
                        }}
                        sx={{ml: 1}}
                        color="inherit"
                    >
                        <em>{`${window.location.origin}/forms/${formBlueprint.id}`}</em>
                    </Button>
                </TabPanel>
                <TabPanel value="3">
                    <Typography variant="h6" gutterBottom component="div">
                        Embed code
                    </Typography>
                    <Button
                        onClick={async () => {
                            await navigator.clipboard.writeText(
                                `${window.location.origin}/forms/${formBlueprint.id}`
                            );
                            enqueueSnackbar("Copied to clipboard", {variant: "success"});
                        }}
                        sx={{ml: 1}}
                        color="inherit"
                    >
                        {String.raw({
                            raw: `<iframe src="${window.location.origin}/forms/${formBlueprint.id}" width="100%" height="100%" ></iframe>`
                        })}
                    </Button>
                </TabPanel>

            </TabContext>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    formBlueprint: PropTypes.object.isRequired,
};

function Modals({title, formBlueprint}) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                {title}
            </Button>
            <SimpleDialog
                formBlueprint={formBlueprint}
                open={open}
                onClose={handleClose}
            />
        </>
    );
}

Modals.getLayout = (page: boolean | ReactChild | ReactFragment | ReactPortal) => <SidebarLayout>{page}</SidebarLayout>;

export default Modals;
