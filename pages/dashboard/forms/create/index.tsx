import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import {Container, Grid,} from '@mui/material';
import Footer from "@/components/Footer";
import {FormCreator} from "@/utils/FormCreator";

function CreateForms() {
  return (
    <>
        <Head>
            <title>Forms - Applications</title>
        </Head>
        <Container maxWidth="lg">
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={12}>
                    <FormCreator/>
                </Grid>
            </Grid>
        </Container>
        <Footer />
    </>
  );
}

CreateForms.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default CreateForms;
