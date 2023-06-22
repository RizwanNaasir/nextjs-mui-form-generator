import React, {useEffect, useState} from "react";

import {styled} from "@mui/material/styles";

import {Button, Container, Grid, Snackbar,} from "@mui/material";
import useFormGenerator, {FormBlueprint} from "@/utils/FormGenerator";
import {useRouter} from "next/router";
import {pb} from "@/utils/PocketBase";

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

const Forms = () => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [jsonBlueprint, setJsonBlueprint] = useState<FormBlueprint>({
        title: '',
        fields: [],
        submissionLimit: new Date(Date.now() + 60 * 60 * 1000) ,
        user_id: 0
    });
    const {formElements, handleSubmit} = useFormGenerator(jsonBlueprint);

    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if (id) {
            setLoading(true);
            pb.collection('formBlueprints').getOne(id as string).then((jsonBlueprint) => {
                setJsonBlueprint(jsonBlueprint as unknown as FormBlueprint);
                setLoading(false);
            }).catch((err) => {
                setMessage(err.message);
                setOpen(true);
                setLoading(false);
            });
        }
    }, [id]);
    const isFormExpired = (submissionLimit: Date | undefined): boolean => {
        if (!submissionLimit) {
            return false; // No submission limit set, form is not expired
        }

        const currentDate = new Date();
        return currentDate > submissionLimit;
    };

    return (
        <StyledRoot>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                message={message}
            />
            <Container maxWidth="sm">
                <StyledContent>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        isFormExpired(jsonBlueprint.submissionLimit) ? (
                            <p>The form has expired.</p>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <h1>{jsonBlueprint.title}</h1>
                                <Grid container spacing={2}>
                                    {formElements}
                                </Grid>
                                <Button type="submit" variant="contained" color="primary">
                                    Export to Excel
                                </Button>
                            </form>
                        )
                    )}
                </StyledContent>
            </Container>
        </StyledRoot>
    );
};

export default Forms;
