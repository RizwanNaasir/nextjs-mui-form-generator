import {useState} from "react";
import {ExtendedFormField, FormBlueprint,} from "@/utils/FormGenerator";
import {Button, Card, CardContent, Divider, MenuItem, Select, TextField} from "@mui/material";
import {TransitionGroup} from 'react-transition-group';
import Collapse from '@mui/material/Collapse';
import {pb} from "@/utils/PocketBase";
import {useSnackbar} from "notistack";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LoadingButton from "@mui/lab/LoadingButton";

function FormCreator() {
    const {enqueueSnackbar} = useSnackbar();
    const [formBlueprints, setFormBlueprints] = useState<FormBlueprint[]>([]);
    const [formTitle, setFormTitle] = useState("");
    const [formFields, setFormFields] = useState<ExtendedFormField[]>([
        {type: "text", label: "", name: "", options: []},
    ]);
    const [submissionLimit, setSubmissionLimit] = useState<Date | undefined>();
    const [loading, setLoading] = useState(false);
    const handleAddQuestion = () => {
        if (formFields.length < 10) {
            setFormFields([...formFields, {type: "text", label: "", name: ""}]);
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
        updatedFields[questionIndex].options[optionIndex].value = value;
        setFormFields(updatedFields);
    };

    const handleAddOption = (questionIndex: number) => {
        const updatedFields = [...formFields];
        console.log('questionIndex', questionIndex, 'updatedFields', updatedFields)
        updatedFields[questionIndex].options.push({label: "", value: ""});
        setFormFields(updatedFields);
    };

    const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
        const updatedFields = [...formFields];
        updatedFields[questionIndex].options.splice(optionIndex, 1);
        setFormFields(updatedFields);
    };

    const handleFormSubmit = async () => {
        setLoading(true);
        const user_pb = await JSON.parse(localStorage.getItem("user") || "{}");
        const newFormBlueprint: FormBlueprint = {
            title: formTitle,
            fields: formFields,
            submissionLimit: submissionLimit,
            user_id: user_pb.id,
        };

        await pb.collection("formBlueprints").create(newFormBlueprint).then((res) => {
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
            setSubmissionLimit(undefined);
            setLoading(false);
        });
    };

    function handleQuestionUpdate(questionIndex: number) {
        return (e) => {
            const updatedFields = [...formFields];
            const value = e.target.value;
            updatedFields[questionIndex].label = value;
            updatedFields[questionIndex].name = value.replace(/\s+/g, "-").toLowerCase();
            updatedFields[questionIndex].options = [];
            setFormFields(updatedFields);
        };
    }

    return (
        <div>
            <h2>Create a Form</h2>
            <TextField
                label="Form Title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Submission Limit"
                type="datetime-local"
                value={
                    submissionLimit
                        ? submissionLimit.toISOString().slice(0, 16)
                        : new Date().toISOString().slice(0, 16)
                }
                onChange={(e) => setSubmissionLimit(new Date(e.target.value))}
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
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
                                        <MenuItem value="text">Text</MenuItem>
                                        <MenuItem value="checkbox">Checkbox</MenuItem>
                                        <MenuItem value="radio">Radio</MenuItem>
                                        <MenuItem value="select">Select</MenuItem>
                                        <MenuItem value="slider">Slider</MenuItem>
                                        <MenuItem value="rating">Rating</MenuItem>
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
                <AddIcon/> Question
            </Button>
        </div>
    );
}

export {FormCreator};
