import React, {useState} from 'react';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField
} from '@mui/material';
import {FormBlueprint, FormField, FormGeneratorResult} from "@/models/form";
import {useRouter} from "next/router";
import {doc, DocumentReference, getDoc, updateDoc} from "@firebase/firestore";
import {db} from "@/utils/Firebase";
import {useSnackbar} from "notistack";

export default function useFormGenerator(jsonBlueprint: FormBlueprint | undefined): FormGeneratorResult {
    const [formValues, setFormValues] = useState<FormField[]>([]);
    const [loading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type, checked} = event.target;
        setFormValues((prevValues) => {
            if (type === 'checkbox') {
                if (checked) {
                    // If checkbox is checked and the checkbox value isn't already in the array, add it
                    return {
                        ...prevValues,
                        [name]: Array.isArray(prevValues[name]) ? [...prevValues[name], value] : [value],
                    };
                } else {
                    // If checkbox is unchecked, remove the checkbox value from the array
                    return {
                        ...prevValues,
                        [name]: Array.isArray(prevValues[name]) ? prevValues[name].filter((v: string) => v !== value) : [],
                    };
                }
            } else {
                // For non-checkbox inputs, just set the value normally
                return {
                    ...prevValues,
                    [name]: value,
                };
            }
        });
    };

    const router = useRouter();
    const {id} = router.query;
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (id) {
            setLoading(true);
            const documentReference = doc(
                db, 'formBlueprints', id as string
            ) as DocumentReference<FormBlueprint>;
            const form = (await getDoc(documentReference)).data() as FormBlueprint;
            updateDoc(documentReference, {
                responses: [...form.responses || [], formValues]
            })
                .then(() => {
                    enqueueSnackbar('Form submitted successfully', {variant: 'success'});
                })
                .catch(async (err) => {
                    enqueueSnackbar(err.message, {variant: 'error'});
                    if (err.message === 'Form not found') {
                        await router.push('/404');
                    }
                })
                .finally(() => {
                    setLoading(false)
                });
        }
    };
    if (!jsonBlueprint) {
        return {
            formElements: <></>,
            handleSubmit
        } as unknown as FormGeneratorResult;
    }

    const formElements = jsonBlueprint.fields.map((field, index) => {
        const {
            type,
            label,
            name,
            xs = 12,
            options
        } = field;

        switch (type) {
            case 'text':
            case 'email':
            case 'textarea':
                return (
                    <Grid item xs={xs} key={index}>
                        <TextField
                            label={label}
                            name={name}
                            type={type}
                            variant="outlined"
                            fullWidth
                            multiline={type === 'textarea'}
                            rows={type === 'textarea' ? 4 : undefined}
                            onChange={handleInputChange}
                            value={formValues[name] || ''}
                        />
                    </Grid>
                );
            case 'checkbox':
                return (
                    <Grid item xs={xs} key={index}>
                        <FormLabel component="legend">{label}</FormLabel>
                        {options?.map((option, optionIndex) => (
                            <FormControlLabel
                                key={optionIndex}
                                control={
                                    <Checkbox
                                        name={name}
                                        value={option.value}
                                        onChange={handleInputChange}
                                    />
                                }
                                label={option.label}
                            />
                        ))}
                    </Grid>
                );
            case 'radio':
                return (
                    <Grid item xs={xs} key={index}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">{label}</FormLabel>
                            <RadioGroup name={name} value={formValues[name] || ''} onChange={handleInputChange}>
                                {options?.map((option, optionIndex) => (
                                    <FormControlLabel
                                        key={optionIndex}
                                        value={option.value}
                                        control={<Radio/>}
                                        label={option.label}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                );
            case 'select':
                return (
                    <Grid item xs={xs} key={index}>
                        <FormControl variant="outlined" fullWidth>
                            <FormLabel component="legend">{label}</FormLabel>
                            <Select
                                label={label}
                                name={name}
                                value={formValues[name] || ''} // Set initial value to ''
                                onChange={handleInputChange}
                            >
                                {options?.map((option, optionIndex) => (
                                    <MenuItem key={optionIndex} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                );
            default:
                return null;
        }
    });

    return {
        formValues,
        formElements,
        isSubmitting: loading,
        handleSubmit,
    } as FormGeneratorResult;
}