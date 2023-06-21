import {useState} from "react";
import {ExtendedFormField, FormBlueprint} from "@/utils/FormGenerator";
import {Button, Card, MenuItem, Select, TextField, CardContent, CardActions} from "@mui/material";

function FormCreator() {
    const [formBlueprints, setFormBlueprints] = useState<FormBlueprint[]>([]);
    const [formTitle, setFormTitle] = useState('');
    const [formFields, setFormFields] = useState<ExtendedFormField[]>([]);
    const [submissionLimit, setSubmissionLimit] = useState<Date | undefined>();

    const handleAddQuestion = () => {
        if (formFields.length < 10) {
            setFormFields([...formFields, {type: 'text', label: '', name: ''}]);
        }
    };

    const handleRemoveQuestion = (index: number) => {
        const updatedFields = [...formFields];
        updatedFields.splice(index, 1);
        setFormFields(updatedFields);
    };

    const handleFieldTypeChange = (index: number, fieldType: ExtendedFormField['type']) => {
        const updatedFields = [...formFields];
        updatedFields[index].type = fieldType;
        setFormFields(updatedFields);
    };
    const handleFormSubmit = () => {
        const newFormBlueprint: FormBlueprint = {
            title: formTitle,
            fields: formFields,
            submissionLimit: submissionLimit,
        };
        console.log(newFormBlueprint, 'newFormBlueprint');
        setFormBlueprints([...formBlueprints, newFormBlueprint]);
        setFormTitle('');
        setFormFields([]);
        setSubmissionLimit(undefined);
    };

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
            <Button variant="contained" color="primary" onClick={handleAddQuestion}>
                Add Question
            </Button>
            <br/>
            <br/>
            {formFields.map((field, index) => (
                <Card sx={{minWidth: 275}} key={index}>
                    <CardContent>
                        <TextField
                            label="Question"
                            value={field.label}
                            onChange={(e) => {
                                const updatedFields = [...formFields];
                                updatedFields[index].label = e.target.value;
                                setFormFields(updatedFields);
                            }}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Field Name"
                            value={field.name}
                            onChange={(e) => {
                                const updatedFields = [...formFields];
                                updatedFields[index].name = e.target.value;
                                setFormFields(updatedFields);
                            }}
                            fullWidth
                            margin="normal"
                        />
                        <Select
                            value={field.type}
                            onChange={(e) => handleFieldTypeChange(index, e.target.value as ExtendedFormField['type'])}
                            fullWidth
                        >
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="checkbox">Checkbox</MenuItem>
                            <MenuItem value="radio">Radio</MenuItem>
                            <MenuItem value="select">Select</MenuItem>
                            <MenuItem value="slider">Slider</MenuItem>
                            <MenuItem value="rating">Rating</MenuItem>
                        </Select>
                    </CardContent>
                    <CardActions>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleRemoveQuestion(index)}
                        >
                            Remove Question
                        </Button>
                    </CardActions> <br/><br/>
                </Card>
            ))}
            <TextField
                label="Submission Limit"
                type="datetime-local"
                value={submissionLimit ? submissionLimit.toISOString().slice(0, -8) : new Date()}
                onChange={(e) => setSubmissionLimit(new Date(e.target.value))}
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <br/>
            <br/>
            <Button variant="contained" color="primary" onClick={handleFormSubmit}>
                Create Form
            </Button>
        </div>
    );
}

export {FormCreator};