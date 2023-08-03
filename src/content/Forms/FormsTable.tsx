import React, {useEffect, useMemo, useState} from 'react';
import {formatDistanceToNow, fromUnixTime} from 'date-fns';
import PropTypes from 'prop-types';
import {
    Button,
    Card,
    Divider,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import {useSnackbar} from "notistack";
import LoadingButton from "@mui/lab/LoadingButton";
import {FormBlueprint} from "@/models/form";
import {auth, db} from "@/utils/Firebase";
import {collection, deleteDoc, doc, Query, query, where} from "@firebase/firestore";
import {useCollection} from "react-firebase-hooks/firestore";
import {useAuthState} from "react-firebase-hooks/auth";
import {NotFound} from "@/components/NotFound";
import Modal from "@/components/Modals";

const FormsTable = () => {
    const [loadingRows, setLoadingRows] = useState([]);
    const [user, userLoading, userError] = useAuthState(auth);

    const {enqueueSnackbar} = useSnackbar();

    const deleteForm = async (id: string) => {
        setLoadingRows([...loadingRows, id]);
        await deleteDoc(doc(db, 'formBlueprints', id))
            .then(() => {
                enqueueSnackbar('Form deleted successfully', {variant: 'success'});
            })
            .catch((err) => {
                enqueueSnackbar(err.message, {variant: 'error'});
            })
            .finally(() => {
                setLoadingRows((prevLoadingRows) => prevLoadingRows.filter((row) => row !== id));
            });
    };

    const formBlueprintsQuery = useMemo(() => {
        return query(
            collection(db, 'formBlueprints'),
            where('user_id', '==', user?.uid || ''),
        ) as Query<FormBlueprint>;
    }, [user, userLoading]);

    const [formBlueprints, loading, error] =
        useCollection<FormBlueprint>(formBlueprintsQuery);
    useEffect(() => {
        if (error) {
            enqueueSnackbar(error.message, {variant: 'error'});
        }
        if (!user && !userLoading) {
            window.location.href = '/auth/login';
        }
    }, [user, userLoading, userError, error]);

    return (
        <>
            {!loading && formBlueprints?.docs.length === 0
                ? <NotFound/>
                : (
                    <Card>
                        <Divider/>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Validity</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading || !formBlueprints ? (
                                        [...Array(5)].map((_, index) => (
                                            <TableRow hover key={index}>
                                                <TableCell>
                                                    <Skeleton variant="text" width={100}/>
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton variant="text" width={100}/>
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton variant="text" width={100}/>
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton variant="text" width={100}/>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (formBlueprints?.docs.map((formBlueprint, index) => {
                                            const form = formBlueprint.data();
                                            return (
                                                <TableRow
                                                    hover
                                                    key={formBlueprint.id}
                                                >
                                                    <TableCell>
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight="bold"
                                                            color="text.primary"
                                                            gutterBottom
                                                            noWrap
                                                        >
                                                            {index + 1}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight="bold"
                                                            color="text.primary"
                                                            gutterBottom
                                                            noWrap
                                                        >
                                                            {form.title.length > 20 ? form.title.substring(0, 20) + '...' : form.title}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight="bold"
                                                            color="text.primary"
                                                            gutterBottom
                                                            noWrap
                                                        >
                                                            {formatDistanceToNow(
                                                                fromUnixTime(form.submissionLimit.seconds),
                                                                {addSuffix: true})
                                                            }
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight="bold"
                                                            color="text.primary"
                                                            gutterBottom
                                                            noWrap
                                                        >
                                                            <Modal title="Send" formBlueprint={formBlueprint}/>
                                                            <Button
                                                                variant="outlined"
                                                                href={`/forms/${formBlueprint.id}`}
                                                                target="_blank"
                                                                sx={{ml: 1}}
                                                            >
                                                                Preview
                                                            </Button>
                                                            <LoadingButton
                                                                variant="contained"
                                                                color="error"
                                                                onClick={async () => {
                                                                    setLoadingRows([...loadingRows, formBlueprint.id]); // Set loading state for the specific row
                                                                    await deleteForm(formBlueprint.id);
                                                                    setLoadingRows(loadingRows.filter((id) => id !== formBlueprint.id)); // Remove loading state for the specific row
                                                                }}
                                                                sx={{ml: 1}}
                                                                loading={loadingRows.includes(formBlueprint.id)} // Use loading state for the specific row
                                                            >
                                                                Delete
                                                            </LoadingButton>
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                )
            }
        </>
    );
};

FormsTable.propTypes = {
    forms: PropTypes.array.isRequired
};

FormsTable.defaultProps = {
    forms: []
};

export default FormsTable;
