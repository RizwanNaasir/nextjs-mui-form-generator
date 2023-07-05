import React from "react";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface FormBlueprint {
    id?: string;
    title: string;
    fields: Array<ExtendedFormField>;
    submissionLimit?: Date | any | Timestamp;
    user_id: string;
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
    formValues: FormField[];
    formElements: JSX.Element[];
    handleSubmit: () => void;
}