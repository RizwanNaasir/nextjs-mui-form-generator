import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Container, Divider, Grid, Skeleton } from '@mui/material';
import useFormGenerator from '@/utils/FormGenerator';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormBlueprint } from '@/models/form';
import { doc, DocumentReference, getDoc } from '@firebase/firestore';
import { db } from '@/utils/Firebase';
import { NotFound } from '@/components/NotFound';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';
import { isFormExpired } from '@/utils/formUtils';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));
const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0)
}));

const Forms = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [jsonBlueprint, setJsonBlueprint] = useState<FormBlueprint | undefined>(
    undefined
  );
  const { formElements, handleSubmit, isSubmitting } =
    useFormGenerator(jsonBlueprint);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    let isMounted = true;
    if (id) {
      const formRef = doc(
        db,
        'formBlueprints',
        id as string
      ) as DocumentReference<FormBlueprint>;

      setLoading(true);
      getDoc(formRef)
        .then((doc) => {
          if (isMounted && doc.exists()) {
            setJsonBlueprint(doc.data() as FormBlueprint);
          } else {
            throw new Error('Form not found');
          }
        })
        .catch(async (err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
          if (isMounted && err.message === 'Form not found') {
            await router.push('/404');
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <StyledRoot>
      <Container maxWidth="sm">
        <StyledContent>
          {loading || !jsonBlueprint ? (
            <>
              <Divider />
              <div>
                <Skeleton variant="text" width={480} height={80} />
                <Skeleton variant="text" width={480} height={80} />
                <Skeleton variant="text" width={480} height={80} />
                <Skeleton variant="text" width={480} height={80} />
              </div>
              <Divider />
            </>
          ) : isFormExpired(jsonBlueprint.submissionLimit) ? (
            <NotFound
              message={
                'The form was expired  ' +
                formatDistanceToNow(
                  fromUnixTime(jsonBlueprint.submissionLimit.seconds),
                  { addSuffix: true }
                )
              }
            />
          ) : (
            <form onSubmit={handleSubmit}>
              <h1>{jsonBlueprint.title}</h1>
              <Divider sx={{ my: '1rem' }} />
              <Grid container spacing={2}>
                {formElements}
              </Grid>
              <Divider sx={{ my: '2rem' }} />
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={loading || isSubmitting}
                sx={{ float: 'right' }}
              >
                Submit
              </LoadingButton>
            </form>
          )}
        </StyledContent>
      </Container>
    </StyledRoot>
  );
};

export default Forms;
