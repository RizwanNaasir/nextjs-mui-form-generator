import SidebarLayout from '@/layouts/SidebarLayout';
import PropTypes from 'prop-types';
import {ReactChild, ReactFragment, ReactPortal, SyntheticEvent, useState} from 'react';
import {Box, IconButton, Stack, Tab, TextField, Typography} from '@mui/material';
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


function SimpleDialog(props: { formBlueprint: FormBlueprint; open: any; onClose: any }) {
    const {open, formBlueprint, onClose} = props;
    const [value, setValue] = useState(1);
    const {enqueueSnackbar} = useSnackbar();


    const handleClose = () => {
    };

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

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
                        <TextField id="emails" label="To" variant="outlined" fullWidth/>
                        <TextField id="subject" label="Subject" variant="outlined" fullWidth/>
                        <TextField id="message" label="Message" variant="outlined" multiline rows={4} fullWidth/>
                    </Box>
                    <LoadingButton
                        variant="contained"
                        loadingIndicator="Loading..."
                        loading={false}
                        sx={{mt: 2, float: "right"}}
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
    selectedValue: PropTypes.string.isRequired
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
