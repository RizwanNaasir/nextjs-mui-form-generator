import React from "react";

import {styled} from "@mui/material/styles";

import {Button, Container, Grid,} from "@mui/material";
import useFormGenerator, {FormBlueprint} from "@/utils/FormGenerator";

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
    const jsonBlueprint: FormBlueprint = {
        title: 'Example Form',
        fields: [
            {
                type: 'text',
                label: 'Name',
                name: 'name',
                multiline: true,
                xs: 12,
                inputProps: {required: true, maxLength: 50},
            },
            {
                type: 'email',
                label: 'Email',
                name: 'email',
                xs: 12,
                inputProps: {required: true},
            },
            {
                type: 'checkbox',
                label: 'Agree to terms and conditions',
                name: 'terms',
                xs: 12,
            },
            {
                type: 'radio',
                label: 'Gender',
                name: 'gender',
                xs: 12,
                options: [
                    {label: 'Male', value: 'male'},
                    {label: 'Female', value: 'female'},
                    {label: 'Other', value: 'other'},
                ],
            },
            {
                type: 'select',
                label: 'Country',
                name: 'country',
                xs: 12,
                options: [
                    {label: 'USA', value: 'usa'},
                    {label: 'Canada', value: 'canada'},
                    {label: 'UK', value: 'uk'},
                ],
            },
            {
                type: 'switch',
                label: 'Enable Notifications',
                name: 'notifications',
                xs: 12,
            },
            {
                type: 'slider',
                label: 'Rating',
                name: 'rating',
                xs: 12,
            },
            {
                type: 'rating',
                label: 'Feedback',
                name: 'feedback',
                xs: 12,
            },
        ],
    };
    const {formElements, handleSubmit} = useFormGenerator(jsonBlueprint);

    return (
        <StyledRoot>
            <Container maxWidth="sm">
                <StyledContent>
                    <form onSubmit={handleSubmit}>
                        <h1>{jsonBlueprint.title}</h1>
                        <Grid container spacing={2}>
                            {formElements}
                        </Grid>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </form>
                </StyledContent>
            </Container>
        </StyledRoot>
    );
};

export default Forms;
