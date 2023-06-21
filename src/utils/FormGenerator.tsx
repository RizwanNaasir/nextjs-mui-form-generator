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
    Rating,
    Select,
    Slider,
    Switch,
    TextField
} from '@mui/material';

export interface FormBlueprint {
    title: string;
    fields: Array<ExtendedFormField>;
    submissionLimit?: Date;
}
export interface FormField {
    type: 'text' | 'email' | 'checkbox' | 'radio' | 'select' | 'switch' | 'slider' | 'rating';
    label: string;
    name: string;
    multiline?: boolean;
    xs?: number; // Optional property to specify the `xs` value for Grid item
    options?: Array<{ label: string; value: string }>; // Only required for radio and select fields
}
export interface ExtendedFormField extends FormField {
    inputProps?: Partial<React.InputHTMLAttributes<HTMLInputElement>>; // Partial InputProps for HTML input elements
}

export interface FormGeneratorResult {
    formElements: JSX.Element[];
    handleSubmit: () => void;
}

function useFormGenerator(jsonBlueprint: FormBlueprint): FormGeneratorResult {
    const [formValues, setFormValues] = useState<any>({});

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type, checked} = event.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setFormValues((prevValues) => ({...prevValues, [name]: inputValue}));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission
        console.log('Form values:', formValues);
    };

    const formElements = jsonBlueprint.fields.map((field, index) => {
        const {
            type,
            label,
            name,
            multiline,
            xs = 12,
            options
        } = field;

        switch (type) {
            case 'text':
            case 'email':
                return (
                    <Grid item xs={xs} key={index}>
                        <TextField
                            label={label}
                            name={name}
                            type={type}
                            variant="outlined"
                            fullWidth
                            multiline={multiline}
                            onChange={handleInputChange}
                            value={formValues[name] || ''}
                        />
                    </Grid>
                );
            case 'checkbox':
                return (
                    <Grid item xs={xs} key={index}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name={name}
                                    checked={formValues[name] || false}
                                    onChange={handleInputChange}
                                />
                            }
                            label={label}
                        />
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
            case 'switch':
                return (
                    <Grid item xs={xs} key={index}>
                        <FormControlLabel
                            control={
                                <Switch
                                    name={name}
                                    checked={formValues[name] || false}
                                    onChange={handleInputChange}
                                />
                            }
                            label={label}
                        />
                    </Grid>
                );
            case 'slider':
                return (
                    <Grid item xs={xs} key={index}>
                        <FormControl>
                            <FormLabel component="legend">{label}</FormLabel>
                            <Slider
                                name={name}
                                value={formValues[name] || 0}
                                onChange={
                                    (_event, value) => handleInputChange({
                                        target: {
                                            name,
                                            value
                                        }
                                    } as unknown as React.ChangeEvent<HTMLInputElement>)
                                }/>
                        </FormControl>
                    </Grid>
                );
            case 'rating':
                return (
                    <Grid item xs={xs} key={index}>
                        <FormControl>
                            <FormLabel component="legend">{label}</FormLabel>
                            <Rating
                                name={name}
                                value={formValues[name] || null}
                                onChange={(_event, value) => handleInputChange({
                                    target: {
                                        name,
                                        value
                                    }
                                } as unknown as React.ChangeEvent<HTMLInputElement>)}
                            />
                        </FormControl>
                    </Grid>
                );
            default:
                return null;
        }
    });
    return {
        formElements,
        handleSubmit,
    } as FormGeneratorResult;
}

export default useFormGenerator;
