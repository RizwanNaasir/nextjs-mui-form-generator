import React, {useEffect, useState} from "react";
import {Button, Card, CardContent, Divider, MenuItem, Select, TextField} from "@mui/material";
import {TransitionGroup} from 'react-transition-group';
import Collapse from '@mui/material/Collapse';
import {useSnackbar} from "notistack";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LoadingButton from "@mui/lab/LoadingButton";
import {ExtendedFormField, FormBlueprint} from "@/models/form";
import {db as firebaseDB} from "@/utils/Firebase";
import {addDoc, collection, CollectionReference, getCountFromServer, query, where} from "@firebase/firestore";
import {useAuthState} from "react-firebase-hooks/auth";
import {getAuth} from 'firebase/auth';
import {DateTimePicker} from "@mui/lab";

function FormCreator() {
    const {enqueueSnackbar} = useSnackbar();
    const [user, userLoading, userError] = useAuthState(getAuth());
    const [formBlueprints, setFormBlueprints] = useState<FormBlueprint[]>([]);
    const [formTitle, setFormTitle] = useState("");
    const [formFields, setFormFields] = useState<ExtendedFormField[]>([
        {type: "text", label: "", name: "", options: []},
    ]);
    const [submissionLimit, setSubmissionLimit] = useState<Date>(new Date());
    const [loading, setLoading] = useState(false);
    const handleAddQuestion = () => {
        const previousQuestionHasLabel = formFields[formFields.length - 1]?.label;

        if (!previousQuestionHasLabel && formFields.length !== 0) {
            enqueueSnackbar("Please fill out the previous question", {variant: "warning"});
            return;
        }

        if (formFields.length <= 9) {
            setFormFields([...formFields, {type: "text", label: "", name: ""}]);
        } else {
            enqueueSnackbar("You have reached the maximum number of questions", {variant: "error"});
        }
    };


    const handleRemoveQuestion = (index: number) => {
        const updatedFields = [...formFields];
        updatedFields.splice(index, 1);
        setFormFields(updatedFields);
    };

    const handleFieldTypeChange = (
        index: number,
        fieldType: ExtendedFormField["type"]
    ) => {
        const updatedFields = [...formFields];
        updatedFields[index].type = fieldType;
        setFormFields(updatedFields);
    };

    const handleOptionChange = (
        questionIndex: number,
        optionIndex: number,
        value: string
    ) => {
        const updatedFields = [...formFields];
        updatedFields[questionIndex].options[optionIndex] = {
            ...updatedFields[questionIndex].options[optionIndex],
            label: value,
            value: value.replace(/\s+/g, "-").toLowerCase()
        };
        setFormFields(updatedFields);
    };

    const handleAddOption = (questionIndex: number) => {
        const updatedFields = [...formFields];
        updatedFields[questionIndex].options.push({label: "", value: ""});
        setFormFields(updatedFields);
    };

    const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
        const updatedFields = [...formFields];
        updatedFields[questionIndex].options.splice(optionIndex, 1);
        setFormFields(updatedFields);
    };

    const handleFormSubmit = async () => {
        if (!formTitle) {
            enqueueSnackbar("Please enter a form title", {variant: "warning"});
            return false;
        }
        setLoading(true);
        const totalForms = await getCountFromServer(
            query(
                collection(firebaseDB, "formBlueprints"),
                where("user_id", "==", user.uid)
            )
        );
        const newFormBlueprint: FormBlueprint = {
            title: formTitle,
            fields: formFields,
            submissionLimit: submissionLimit,
            user_id: user.uid,
        };
        if (totalForms.data().count >= 10) {
            enqueueSnackbar("You have reached the maximum number of forms", {variant: "error"});
            setLoading(false);
            return;
        }
        const formBlueprintsRef = collection(
            firebaseDB, 'formBlueprints'
        ) as CollectionReference<FormBlueprint>;

        await addDoc<FormBlueprint>(formBlueprintsRef, newFormBlueprint)
            .then((res) => {
                enqueueSnackbar(
                    "Form created successfully",
                    {
                        variant: "success",
                        action: () => (
                            <Button
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        window.location.origin + "/forms/" + res.id
                                    );
                                enqueueSnackbar("Copied to clipboard", {variant: "success"});
                            }}
                            color="inherit"
                        >
                            Copy Link
                        </Button>
                    ),
                }
            );

            setFormBlueprints([...formBlueprints, newFormBlueprint]);
            setFormTitle("");
                setFormFields([]);
                setSubmissionLimit(new Date());
                setLoading(false);
        });
    };

    function handleQuestionUpdate(questionIndex: number) {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const updatedFields = [...formFields];
            const value = e.target.value;
            updatedFields[questionIndex].label = value;
            updatedFields[questionIndex].name = value.replace(/\s+/g, "-").toLowerCase();
            updatedFields[questionIndex].options = [];
            setFormFields(updatedFields);
        };
    }

    useEffect(() => {
        if (!user && !userLoading) {
            window.location.href = '/auth/login';
        }
    }, [user, userLoading, userError]);
    return (
        <div>
            <h2>Create a Form</h2>
            <TextField
                label="Form Title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <DateTimePicker
                label="Submission Limit"
                value={submissionLimit ? submissionLimit : new Date()}
                onChange={(e) => setSubmissionLimit(new Date(e))}
                renderInput={(props) => (
                    <TextField
                        {...props}
                        fullWidth
                        sx={{mt: 2}}
                        variant="outlined"
                        inputProps={{
                            ...props.inputProps,
                            maxLength: 16 // Limit the input to 16 characters
                        }}
                    />
                )}
            />

            <Divider sx={{mt: "1rem"}}/>

            <br/>
            <br/>
            <TransitionGroup>
                {formFields.map((field, questionIndex) => (
                    <Collapse key={questionIndex}>
                        <Card sx={{my: 2}}>
                            <CardContent>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <TextField
                                        label="Question"
                                        value={field.label}
                                        onChange={handleQuestionUpdate(questionIndex)}
                                        fullWidth
                                        required
                                        sx={{m: "1rem"}}
                                    />
                                    <Select
                                        value={field.type}
                                        onChange={(e) =>
                                            handleFieldTypeChange(
                                                questionIndex,
                                                e.target.value as ExtendedFormField["type"]
                                            )
                                        }
                                        fullWidth
                                        sx={{m: "1rem"}}
                                    >
                                        <MenuItem value="text">Short answer</MenuItem>
                                        <MenuItem value="textarea">Paragraph</MenuItem>
                                        <MenuItem value="checkbox">Checkbox</MenuItem>
                                        <MenuItem value="radio">Multiple Choice</MenuItem>
                                        <MenuItem value="select">Drop-down</MenuItem>
                                    </Select>
                                </div>
                                <Divider sx={{m: "1rem"}}/>
                                {field.options && field.options.length > 0 && (
                                    <>
                                        <TransitionGroup>
                                            {field.options.map((option, optionIndex) => (
                                                <Collapse key={optionIndex}>
                                                    <div style={{display: "flex", alignItems: "center"}}>
                                                        <TextField
                                                            label="Label"
                                                            value={option.label}
                                                            onChange={(e) =>
                                                                handleOptionChange(questionIndex, optionIndex, e.target.value)
                                                            }
                                                            fullWidth
                                                            required
                                                            margin="normal"
                                                            sx={{m: "1rem"}}
                                                        />
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            sx={{p: '0.8rem', m: 1}}
                                                            onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                                                        >
                                                            <RemoveIcon/>
                                                        </Button>
                                                    </div>
                                                </Collapse>
                                            ))}
                                        </TransitionGroup>
                                    </>
                                )}
                                {(field.type === "checkbox" || field.type === "select" || field.type === "radio") && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleAddOption(questionIndex)}
                                        sx={{m: "1rem"}}
                                    >
                                        <AddIcon/> Options
                                    </Button>
                                )}
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleRemoveQuestion(questionIndex)}
                                    sx={{float: "right", m: 2}}
                                >
                                    <DeleteIcon/>
                                </Button>
                            </CardContent>
                        </Card>
                    </Collapse>
                ))}
            </TransitionGroup>
            <LoadingButton
                variant="contained"
                color="success"
                onClick={handleFormSubmit}
                sx={{float: "right", m: 2}}
                loading={loading}
            >
                Create Form
            </LoadingButton>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddQuestion}
                sx={{float: "right", m: 2}}
            >
                <AddIcon/> Question ({10 - formFields.length} left)
            </Button>
        </div>
    );
}

export {FormCreator};
