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
import {generateExcelSheet} from "@/utils/generateExcelSheet";
import {FormBlueprint, FormGeneratorResult} from "@/models/form";

export default function useFormGenerator(jsonBlueprint: FormBlueprint | undefined): FormGeneratorResult {
    const [formValues, setFormValues] = useState<{ [key: string]: any }>({});

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type, checked} = event.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setFormValues((prevValues) => ({...prevValues, [name]: inputValue}));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        generateExcelSheet(formValues);
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
        handleSubmit,
    } as FormGeneratorResult;
}