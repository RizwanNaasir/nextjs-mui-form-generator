import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import {Container, Grid,} from '@mui/material';
import Footer from "@/components/Footer";
import FormsTable from "@/content/Forms/FormsTable";

function ListForms() {

  return (
    <>
        <Head>
            <title>Forms - Applications</title>
        </Head>
        <Container maxWidth="lg" sx={{mt: 3}}>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
            >
                <Grid item xs={12}>
                    <FormsTable/>
                </Grid>
            </Grid>
        </Container>
        <Footer />
    </>
  );
}

ListForms.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ListForms;
