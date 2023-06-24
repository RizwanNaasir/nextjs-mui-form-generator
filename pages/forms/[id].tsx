import React, {useEffect, useState} from "react";

import {styled} from "@mui/material/styles";

import {CircularProgress, Container, Divider, Grid} from "@mui/material";
import useFormGenerator from "@/utils/FormGenerator";
import {useRouter} from "next/router";
import {pb} from "@/utils/PocketBase";
import {useSnackbar} from "notistack";
import LoadingButton from "@mui/lab/LoadingButton";
import {FormBlueprint} from "@/models/form";

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
    const {enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);
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
                enqueueSnackbar(err.message, {variant: 'error'});
                setLoading(false);
                if (err.status === 404) {
                    router.push('/404');
                }
            });
        }
    }, [id]);
    const isFormExpired = (submissionLimit: Date | undefined): boolean => {
        if (!submissionLimit) {
            return false; // No submission limit set, form is not expired
        }
        return (new Date() > new Date(submissionLimit));
    };

    return (
        <StyledRoot>
            <Container maxWidth="sm">
                <StyledContent>
                    {loading ? (
                        <CircularProgress/>
                    ) : (
                        isFormExpired(jsonBlueprint.submissionLimit) ? (
                            <p>The form was expired at {jsonBlueprint.submissionLimit.toString()}</p>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <h1>{jsonBlueprint.title}</h1>
                                <Divider sx={{my: "1rem"}}/>
                                <Grid container spacing={2}>
                                    {formElements}
                                </Grid>
                                <Divider sx={{my: "2rem"}}/>
                                <LoadingButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    loading={loading}
                                    sx={{float: 'right'}}
                                >
                                    Export to Excel
                                </LoadingButton>
                            </form>
                        )
                    )}
                </StyledContent>
            </Container>
        </StyledRoot>
    );
};

export default Forms;
