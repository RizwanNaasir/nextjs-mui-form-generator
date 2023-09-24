import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Container, Grid,} from '@mui/material';
import Footer from '@/components/Footer';
import FormsTable from '@/content/Forms/FormsTable';
// import Link from 'next/link';


function ListForms() {
  return (
    <>
      <Head>
        <title>Forms - Applications</title>
      </Head>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <FormsTable />
          </Grid>
        </Grid>
      </Container>


        {/*<Container maxWidth="lg" sx={{ mt: 3, textAlign: 'center' }}>*/}
        {/*    <Link href="/testing">*/}
        {/*        <Button variant="contained" color="warning">*/}
        {/*            Go to Virtual University*/}
        {/*        </Button>*/}
        {/*    </Link>*/}
        {/*</Container>*/}

      <Footer />
    </>
  );
}

ListForms.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ListForms;
