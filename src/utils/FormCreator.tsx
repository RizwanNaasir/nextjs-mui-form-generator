import {useState} from "react";
import {ExtendedFormField, FormBlueprint} from "@/utils/FormGenerator";
import {Button, Card, CardActions, CardContent, MenuItem, Select, TextField} from "@mui/material";
import {pb} from "@/utils/PocketBase";
import {useSnackbar} from 'notistack';

function FormCreator() {
    const {enqueueSnackbar} = useSnackbar();
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
    const handleFormSubmit = async () => {
        const user_pb = await JSON.parse(localStorage.getItem('user') || '{}')
        const newFormBlueprint: FormBlueprint = {
            title: formTitle,
            fields: formFields,
            submissionLimit: submissionLimit,
            user_id: user_pb.id
        };
        console.log(newFormBlueprint, 'newFormBlueprint');

        await pb.collection('formBlueprints').create(newFormBlueprint).then(() => {
            enqueueSnackbar('Form created successfully', {variant: 'success'});
            setFormBlueprints([...formBlueprints, newFormBlueprint]);
            setFormTitle('');
            setFormFields([]);
            setSubmissionLimit(undefined)
        });
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
            <TextField
                label="Submission Limit"
                type="datetime-local"
                value={submissionLimit ? submissionLimit.toISOString().slice(0, -8) : (new Date()).toISOString()}
                onChange={(e) => setSubmissionLimit(new Date(e.target.value))}
                fullWidth
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <br/>
            <br/>
            {formFields.map((field, index) => (
                <Card sx={{my: 2}} key={index}>
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
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleRemoveQuestion(index)}
                            sx={{float: 'right', m: 2}}
                        >
                            Remove Question
                        </Button>
                    </CardContent>
                    <CardActions>

                    </CardActions>
                </Card>
            ))}
            <Button variant="contained" color="success" onClick={handleFormSubmit} sx={{float: 'right', m: 2}}>
                Create Form
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddQuestion}
                sx={{float: 'right', m: 2}}
            >
                Add Question
            </Button>
        </div>
    );
}

export {FormCreator};