import SidebarLayout from '@/layouts/SidebarLayout';
import PropTypes from 'prop-types';
import {ReactChild, ReactFragment, ReactPortal, SetStateAction, SyntheticEvent, useState} from 'react';
import {Box, Stack, Tab, TextField, Typography} from '@mui/material';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {TabContext, TabList, TabPanel} from "@mui/lab";
import Mail from '@mui/icons-material/Mail';
import Link from '@mui/icons-material/Link';
import Code from '@mui/icons-material/Code';

const emails = ['username@gmail.com', 'user02@gmail.com'];

function SimpleDialog(props: { onClose: any; selectedValue: any; open: any; }) {
    const {onClose, selectedValue, open} = props;
    const [value, setValue] = useState(1);


    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Send form</DialogTitle>
            <TabContext value={value.toString()}>
                <Box sx={{borderBottom: 1, borderColor: 'divider', p: 2}}>
                    <Stack direction="row" spacing={2}>
                        <h3>Send via
                        </h3>
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
                            '& > :not(style)': {m: 1, width: '25ch'},
                        }}
                    >
                        <Typography variant="h6" gutterBottom component="div">
                            Email
                        </Typography>
                        <TextField id="emails" label="To" variant="outlined"/>
                        <TextField id="subject" label="Subject" variant="outlined"/>
                        <TextField id="message" label="Message" variant="outlined" multiline sx={{width: 'full'}}/>
                    </Box>
                </TabPanel>
                <TabPanel value="2">Item Two</TabPanel>
                <TabPanel value="3">Item Three</TabPanel>

            </TabContext>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired
};

function Modals({title}) {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(emails[1]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value: SetStateAction<string>) => {
        setOpen(false);
        setSelectedValue(value);
    };

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpen}>
                {title}
            </Button>
            <SimpleDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
            />
        </>
    );
}

Modals.getLayout = (page: boolean | ReactChild | ReactFragment | ReactPortal) => <SidebarLayout>{page}</SidebarLayout>;

export default Modals;
