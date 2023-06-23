import React, {ChangeEvent, useEffect, useState} from 'react';
import {format} from 'date-fns';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Card,
    Divider,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {FormBlueprint} from "@/utils/FormGenerator";
import {pb} from "@/utils/PocketBase";
import Link from "@/components/Link";
import {useSnackbar} from "notistack";
import LoadingButton from "@mui/lab/LoadingButton";

const applyPagination = (
    forms: FormBlueprint[],
    _page: number,
    _limit: number
): FormBlueprint[] => {
    return forms;
};

const FormsTable = () => {
    const [forms, setForms] = useState<FormBlueprint[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingRows, setLoadingRows] = useState([]);
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);
    const [total, setTotal] = useState<number>(0);
    const handlePageChange = (_event: any, newPage: number): void => {
        setPage(newPage);
    };
    const {enqueueSnackbar} = useSnackbar();
    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    const paginatedForms = applyPagination(
        forms,
        page,
        limit
    );
    const deleteForm = async (id: string) => {
        setLoading(true);
        await pb.collection('formBlueprints').delete(id).then(() => {
            setForms(forms.filter((form) => form.id !== id));
            enqueueSnackbar('Form deleted successfully', {variant: 'success'});
            setLoading(false);
        }).catch((err) => {
            enqueueSnackbar(err.message, {variant: 'error'});
            setLoading(false);
        });
    }
    useEffect(() => {
        setLoading(true);
        pb.collection('formBlueprints')
            .getList(page, limit, {sort: 'title', order: 'asc', expand: 'user_id'})
            .then((data) => {
                setForms(data.items as unknown as FormBlueprint[]);
                setTotal(data.totalItems);
                setPage(data.page);
                setLimit(data.perPage);
                setLoading(false);
            }).catch((err) => {
            enqueueSnackbar(err.message, {variant: 'error'});
            setLoading(false);
        });
    }, [page, limit]);

    return (
        <Card>
            <Divider/>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Form ID</TableCell>
                            <TableCell>User ID</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(loading && forms.length === 0)
                            ? (
                                [...Array(5)].map((_, index) => (
                                    <TableRow hover key={index}>
                                        <TableCell>
                                            <Skeleton variant="text" width={100}/>
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
                            )
                            : paginatedForms.map((form) => {
                                return (
                                    <TableRow
                                        hover
                                        key={form.id}
                                    >
                                        <TableCell>
                                            <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                color="text.primary"
                                                gutterBottom
                                                noWrap
                                            >
                                                {form.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {format(new Date(form.submissionLimit), 'MMMM dd yyyy')}
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
                                                <Link href={`/forms/${form.id}`} target="_blank">
                                                    {form.id}
                                                    <OpenInNewIcon fontSize="inherit" sx={{ml: 1}}/>
                                                </Link>
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
                                                {form.user_id}
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
                                                <Button
                                                    variant="contained"
                                                    href={`/forms/${form.id}`}
                                                    target="_blank"
                                                >
                                                    Open
                                                </Button>
                                                <LoadingButton
                                                    variant="contained"
                                                    color="error"
                                                    onClick={async () => {
                                                        setLoadingRows([...loadingRows, form.id]); // Set loading state for the specific row
                                                        await deleteForm(form.id);
                                                        setLoadingRows(loadingRows.filter((id) => id !== form.id)); // Remove loading state for the specific row
                                                    }}
                                                    sx={{ml: 1}}
                                                    loading={loadingRows.includes(form.id)} // Use loading state for the specific row
                                                >
                                                    Delete
                                                </LoadingButton>
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Box p={2}>
                <TablePagination
                    component="div"
                    count={total}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[5, 10, 25, 30]}
                />
            </Box>
        </Card>
    );
};

FormsTable.propTypes = {
    forms: PropTypes.array.isRequired
};

FormsTable.defaultProps = {
    forms: []
};

export default FormsTable;
